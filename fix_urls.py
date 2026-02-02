
import os

def replace_in_file(filepath, find_str, replace_str):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if find_str not in content:
        print(f"String '{find_str}' not found in {filepath}")
        return False
    
    new_content = content.replace(find_str, replace_str)
    
    with open(filepath, 'w', encoding='utf-8', newline='\n') as f:
        f.write(new_content)
    print(f"Successfully updated {filepath}")
    return True

# Update checkout.html
checkout_path = r'c:\Users\pstma\OneDrive\Documents\uk\checkout.html'
replace_in_file(checkout_path, "fetch('http://localhost:3001/api/checkout/create-session'", "fetch('https://customisemeuk.com/api/checkout/create-session'")

# Update order-confirmation.html
conf_path = r'c:\Users\pstma\OneDrive\Documents\uk\order-confirmation.html'
replace_in_file(conf_path, "fetch('http://localhost:3001/api/orders/verify-payment'", "fetch('https://customisemeuk.com/api/orders/verify-payment'")
