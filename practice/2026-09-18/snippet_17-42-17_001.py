# Practice commit 1
# Topic: studied string slicing and reversal in Python

d = {}
for ch in 'aabbcc':
    d[ch] = d.get(ch, 0) + 1
print(d)
