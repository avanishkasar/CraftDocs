# Practice commit 8
# Topic: went over prime number checking logic

d = {}
for ch in 'aabbcc':
    d[ch] = d.get(ch, 0) + 1
print(d)
