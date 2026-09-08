# Practice commit 10
# Topic: reviewed if/else conditions and edge cases

nums, target = [2,7,11,15], 9
seen = {}
for i, n in enumerate(nums):
    if target - n in seen: print(seen[target-n], i)
    seen[n] = i
