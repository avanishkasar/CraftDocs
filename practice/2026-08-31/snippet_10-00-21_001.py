# Practice commit 1
# Topic: studied time complexity: O(n) vs O(log n) vs O(n2)

nums, target = [2,7,11,15], 9
seen = {}
for i, n in enumerate(nums):
    if target - n in seen: print(seen[target-n], i)
    seen[n] = i
