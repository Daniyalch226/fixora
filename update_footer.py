import glob
import re

app_store_html = '''                    <div style="display: flex; gap: 16px; margin-top: 24px;">
                        <a href="#"><i data-lucide="facebook"></i></a>
                        <a href="#"><i data-lucide="twitter"></i></a>
                        <a href="#"><i data-lucide="instagram"></i></a>
                        <a href="#"><i data-lucide="linkedin"></i></a>
                    </div>
                    <div style="display: flex; gap: 12px; margin-top: 24px; flex-wrap: wrap;">
                        <a href="#" style="display: inline-flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); padding: 6px 12px; border-radius: 8px; color: white; text-decoration: none; transition: all 0.3s;">
                            <i data-lucide="apple" style="width: 20px; height: 20px;"></i>
                            <div style="display: flex; flex-direction: column; line-height: 1;">
                                <span style="font-size: 0.55rem; opacity: 0.8; margin-bottom: 2px;">Download on the</span>
                                <span style="font-size: 0.8rem; font-weight: 600;">App Store</span>
                            </div>
                        </a>
                        <a href="#" style="display: inline-flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); padding: 6px 12px; border-radius: 8px; color: white; text-decoration: none; transition: all 0.3s;">
                            <i data-lucide="play" style="width: 20px; height: 20px;"></i>
                            <div style="display: flex; flex-direction: column; line-height: 1;">
                                <span style="font-size: 0.55rem; opacity: 0.8; margin-bottom: 2px;">GET IT ON</span>
                                <span style="font-size: 0.8rem; font-weight: 600;">Google Play</span>
                            </div>
                        </a>
                    </div>'''

payment_icons_html = '''                <div class="payment-methods" style="display: flex; gap: 10px; align-items: center;">
                    <div style="background: #fff; padding: 2px 6px; border-radius: 4px; display: inline-flex; align-items: center; justify-content: center; height: 24px;">
                        <span style="font-weight: 900; font-style: italic; color: #1a1f71; font-size: 0.75rem; letter-spacing: -0.5px;">VISA</span>
                    </div>
                    <div style="background: #fff; padding: 0 6px; border-radius: 4px; display: inline-flex; align-items: center; justify-content: center; height: 24px;">
                        <div style="width: 14px; height: 14px; background: #eb001b; border-radius: 50%;"></div>
                        <div style="width: 14px; height: 14px; background: #f79e1b; border-radius: 50%; margin-left: -6px; mix-blend-mode: multiply;"></div>
                    </div>
                    <div style="background: #2e77bc; padding: 2px 6px; border-radius: 4px; display: inline-flex; align-items: center; justify-content: center; height: 24px;">
                        <span style="font-weight: 700; color: #fff; font-size: 0.65rem; letter-spacing: 0.5px;">AMEX</span>
                    </div>
                </div>'''

for file in glob.glob('*.html'):
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # regex search for social block
    social_pattern = re.compile(r'[\t ]*<div style="display: flex; gap: 16px; margin-top: 24px;">\s*<a href="#"><i data-lucide="facebook"></i></a>\s*<a href="#"><i data-lucide="twitter"></i></a>\s*<a href="#"><i data-lucide="instagram"></i></a>\s*<a href="#"><i data-lucide="linkedin"></i></a>\s*</div>')
    content = social_pattern.sub(app_store_html, content)
    
    # regex search for payment block
    payment_pattern = re.compile(r'[\t ]*<div class="payment-icons">\s*<i data-lucide="credit-card"></i>\s*<i data-lucide="wallet"></i>\s*<i data-lucide="shield-check"></i>\s*</div>')
    content = payment_pattern.sub(payment_icons_html, content)
    
    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'Updated {file}')
