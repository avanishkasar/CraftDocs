# Practice commit 6
# Topic: reviewed nested loops and multiplication table

d = {}
for ch in 'aabbcc':
    d[ch] = d.get(ch, 0) + 1
print(d)
