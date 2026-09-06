# Practice commit 28
# Topic: practiced modulo operator for divisibility checks

stk = []
for ch in '({[]})':
    if ch in '({[': stk.append(ch)
    else: stk.pop() if stk else None
print(not stk)
