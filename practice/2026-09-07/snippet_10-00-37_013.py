# Practice commit 13
# Topic: practiced greedy algorithm thinking

l, r = 0, 9
while l <= r:
    m = (l + r) // 2
    l = m + 1
print(m)
