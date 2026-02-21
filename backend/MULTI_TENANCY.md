# Multi-Tenancy Architecture & Scaling Guide

This document explains how Card Vault handles multiple users' data efficiently and provides scaling strategies as you grow.

## Current Implementation: Field-Based Multi-Tenancy

### How It Works

Every document in the database includes a `user_id` field that identifies the owner:

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "user_id": "user_abc123",
  "name": "Charizard",
  "set": "Base Set",
  ...
}
```

All queries automatically filter by the authenticated user's ID:
```python
# Backend always does this
db.cards.find({'user_id': current_user_id})
```

### Advantages
✅ **Cost-effective** - Single database, shared infrastructure  
✅ **Simple** - Easy to implement and understand  
✅ **Efficient** - Minimal data duplication  
✅ **Flexible** - Users can share data easily (future feature)  
✅ **Scales well** - Works for thousands to millions of users  

### Disadvantages
❌ **Shared infrastructure** - One user's heavy queries could affect others  
❌ **Less isolation** - Single point of failure  
❌ **No per-tenant customization** - Cannot customize database per user  

---

## Scaling Strategies

### Level 1: Current Setup (0 - 10,000 Users)
**Cost**: $0-20/month  
**Maintenance**: Minimal

- Single MongoDB database
- Single Flask server
- Field-based isolation with indexes

**Action Items:**
- ✅ Create index on `user_id` for fast queries (DONE)
- ✅ Implement JWT token expiry (DONE)
- Add query pagination for large collections

### Level 2: Multiple Servers (10K - 100K Users)
**Cost**: $50-200/month  
**Maintenance**: Moderate

When traffic increases, add load balancing:

```
┌─────────────┐
│   Nginx     │ (Load Balancer)
└──────┬──────┘
       │
    ┌──┴──┐
    │     │
  ┌─▼─┐  ┌─▼─┐
  │F1 │  │F2 │  (Flask Servers)
  └─┬─┘  └─┬─┘
    │     │
    └──┬──┘
       │
    ┌──▼──────┐
    │ MongoDB  │
    └──────────┘
```

**Implementation:**
1. Spin up multiple Flask servers
2. Use Nginx to distribute traffic
3. MongoDB stays centralized
4. Add Redis for session caching

### Level 3: Vertical Sharding (100K - 1M Users)
**Cost**: $200-1000+/month  
**Maintenance**: Significant

Split data by user ID ranges:

```
User 000-333: Server A → MongoDB Shard 1
User 334-666: Server B → MongoDB Shard 2
User 667-999: Server C → MongoDB Shard 3
```

**Benefits:**
- Distribute load across databases
- Faster queries (smaller collections)
- Easy to scale horizontally

**Implementation:**
1. Add shard key (`user_id`) to all collections
2. Enable MongoDB sharding
3. Map users to shards based on ID

### Level 4: Database Per Tenant (Highest Isolation)
**Cost**: $1000+/month  
**Maintenance**: High

Each user gets their own database:

```
User 123 → MongoDB Instance A
User 456 → MongoDB Instance B
User 789 → MongoDB Instance C
```

**Best for:**
- Enterprise customers
- Strict compliance/isolation requirements
- SaaS with white-labeling

**Implementation:**
1. Create dynamic connection pooling
2. Route queries based on user_id
3. Each user has full database isolation

---

## Recommended Approach by Stage

### Stage 1: MVP (Current)
**Use**: Field-based multi-tenancy  
**Why**: Simplest, cost-effective, good enough for launch

### Stage 2: Growth (1K+ Users)
**Use**: Field-based + indexes + pagination  
**Why**: Still simple, performs well, minimal cost

### Stage 3: Scale (10K+ Users)
**Use**: Multiple Flask servers + MongoDB replica set  
**Why**: Distribute load, ensure high availability

### Stage 4: Enterprise (100K+ Users)
**Use**: Sharded MongoDB + Multi-region deployment  
**Why**: Handle massive scale with regional distribution

---

## Data Isolation Best Practices

### ✅ DO

```python
# Always include user_id in queries
db.cards.find({'user_id': user_id})

# Verify ownership before updates/deletes
card = db.cards.find_one({'_id': card_id, 'user_id': user_id})
if not card:
    return error('Unauthorized')

# Index frequently queried fields
db.cards.create_index([('user_id', 1), ('created_at', -1)])

# Use projection to exclude sensitive data
card = db.cards.find_one(
    {'_id': card_id, 'user_id': user_id},
    {'password': 0}  # Exclude password
)
```

### ❌ DON'T

```python
# Never skip user_id check
db.cards.find({'_id': card_id})  # ❌ Could access other users' cards!

# Never trust client input for filtering
db.cards.find({'user_id': request.args.get('user_id')})  # ❌ Bad!

# Always verify in backend
# ✅ Use authenticated user from token
db.cards.find({'user_id': request.user_id})  # ✅ Good!
```

---

## Example: Implementing User Sharing (Future Feature)

Once you want users to share collections:

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "owner_id": "user_abc123",
  "shared_with": ["user_def456", "user_ghi789"],
  "permissions": "view"
}
```

Query becomes:
```python
db.cards.find({
    '$or': [
        {'owner_id': user_id},
        {'shared_with': user_id}
    ]
})
```

---

## Cost Comparison (Approximate Annual)

| Strategy | Users | Cost | Maintenance |
|----------|-------|------|-------------|
| Single DB | <1K | $0-50 | Minimal |
| Indexed + Caching | <10K | $50-200 | Low |
| Sharded | <100K | $200-1000 | Medium |
| Database Per Tenant | <50K/enterprise | $1000+ | High |
| Multi-Region | <1M | $2000+ | Very High |

---

## Monitoring & Performance

### Key Metrics to Track

```python
# Add monitoring to track these
- Queries per second per user
- Average query time
- Database size growth
- User count growth
- Token refresh rate
```

### Simple Monitoring Query

```bash
# Check slow queries (>100ms)
db.system.profile.find({millis: {$gt: 100}})

# Check collection sizes
db.cards.stats()
db.binders.stats()
```

---

## Migration Path

When ready to scale from Level 1 to Level 2:

1. **Add indexes** (you're already doing this)
2. **Enable query caching** with Redis
3. **Add Flask load balancer** (Nginx)
4. **Monitor performance**
5. **Scale horizontally** by adding more Flask instances
6. **Consider MongoDB replica set** for redundancy

No code changes needed - just infrastructure!

---

## Questions Before Implementing

Before choosing a strategy, ask:

1. **How many users do you expect?**
   - <1K: Current approach is perfect
   - 1K-10K: Add caching/load balancer
   - 10K+: Plan sharding

2. **What's your compliance requirement?**
   - GDPR needed? Consider data residency
   - Enterprise SLA needed? Add replicas

3. **What's your budget?**
   - Free tier? Single database
   - $50-100/month? Multiple servers
   - $500+/month? Full sharding

4. **Do you need real-time sync?**
   - If yes, add Redis or WebSockets
   - If no, current setup is fine

---

## TL;DR

Your current setup uses **field-based multi-tenancy** which:
- ✅ Works for thousands of users
- ✅ Is simple and reliable
- ✅ Costs very little
- ✅ Can scale horizontally by adding more servers

When you hit 10K+ users, add a load balancer and more Flask servers. No database changes needed.

Don't over-engineer - start simple, scale as needed! 🚀
