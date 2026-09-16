# Practice commit 2
# Topic: reviewed nested loops and multiplication table

a, b = 0, 1
for _ in range(10):
    print(a, end=' ')
    a, b = b, a + b
