-- KEYS[1]: Stock key (e.g. flash_sale:stock:FLASH_IPHONE_16)
-- ARGV[1]: Quantity to deduct

local key = KEYS[1]
local quantity = tonumber(ARGV[1])

local currentStock = redis.call('GET', key)

if not currentStock then
    return -2 -- Product stock key not found/initialized
end

currentStock = tonumber(currentStock)

if currentStock < quantity then
    return -1 -- Out of stock / Sold out
end

-- Atomic deduction
local remaining = redis.call('DECRBY', key, quantity)
return remaining
