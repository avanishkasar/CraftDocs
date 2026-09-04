# Practice commit 6
# Topic: revised return vs print: key difference in functions

nums, target = [2,7,11,15], 9
seen = {}
for i, n in enumerate(nums):
    if target - n in seen: print(seen[target-n], i)
    seen[n] = i
