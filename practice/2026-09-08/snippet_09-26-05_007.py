# Practice commit 7
# Topic: studied list.append() and list.extend()

d = {}
for ch in 'aabbcc':
    d[ch] = d.get(ch, 0) + 1
print(d)
