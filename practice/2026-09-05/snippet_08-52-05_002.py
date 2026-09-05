# Practice commit 2
# Topic: went over while loop termination conditions

s = 'hello world'
count = sum(1 for c in s.lower() if c in 'aeiou')
print(count)
