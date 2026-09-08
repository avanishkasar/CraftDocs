# Practice commit 3
# Topic: studied binary search: how it halves search space

l, r = 0, 9
while l <= r:
    m = (l + r) // 2
    l = m + 1
print(m)
