# Practice commit 13
# Topic: practiced stack-based problem solving

stk = []
for ch in '({[]})':
    if ch in '({[': stk.append(ch)
    else: stk.pop() if stk else None
print(not stk)
