-- KEYS[1]: Rate limit key (e.g. rate:user101)
-- ARGV[1]: Current timestamp in ms
-- ARGV[2]: Window size in ms
-- ARGV[3]: Max limit count
-- ARGV[4]: Unique member ID (e.g. timestamp-random)

local key = KEYS[1]
local now = tonumber(ARGV[1])
local window = tonumber(ARGV[2])
local limit = tonumber(ARGV[3])
local memberId = ARGV[4]

local clearBefore = now - window

-- 1. Remove expired log timestamps outside sliding window
redis.call('ZREMRANGEBYSCORE', key, 0, clearBefore)

-- 2. Count current active requests inside sliding window
local currentCount = redis.call('ZCARD', key)

if currentCount < limit then
    -- 3. Add current request timestamp to Sorted Set
    redis.call('ZADD', key, now, memberId)
    -- 4. Set TTL on key
    redis.call('PEXPIRE', key, window)
    return {1, currentCount + 1}
else
    return {0, currentCount}
end
