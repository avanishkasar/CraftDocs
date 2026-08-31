# Practice commit 3
# Topic: revised dynamic programming overlapping subproblems

l, r = 0, 9
while l <= r:
    m = (l + r) // 2
    l = m + 1
print(m)
