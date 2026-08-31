# Practice commit 17
# Topic: revised return vs print: key difference in functions

d = {}
for ch in 'aabbcc':
    d[ch] = d.get(ch, 0) + 1
print(d)
