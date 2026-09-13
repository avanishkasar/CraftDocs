# Practice commit 14
# Topic: revised integer division // vs true division /

l, r = 0, 9
while l <= r:
    m = (l + r) // 2
    l = m + 1
print(m)
