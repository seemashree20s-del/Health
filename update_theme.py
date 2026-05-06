import re

with open("style.css", "r") as f:
    css = f.read()

# Replace :root
old_root = re.search(r":root \{.*?\n\}", css, flags=re.DOTALL).group(0)
new_root = """:root {
  /* Premium Ocean Light Theme Tokens */
  --bg-base: #f0f4f8;
  --bg-surface: #ffffff;
  --bg-glass: rgba(255, 255, 255, 0.85);
  --border-glass: rgba(2, 132, 199, 0.15);
  
  --primary-accent: #0284c7; /* Ocean Blue */
  --primary-glow: rgba(2, 132, 199, 0.3);
  --secondary-accent: #10b981; /* Health Green */
  
  --text-main: #0f172a; /* Dark Slate Gray */
  --text-muted: #64748b; /* Medium Slate Gray */
  --text-inverse: #ffffff;
  
  --danger: #ef4444;
  --warning: #f59e0b;

  --font-heading: 'Outfit', sans-serif;
  --font-body: 'Inter', sans-serif;

  --transition-smooth: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  --radius-lg: 16px;
  --radius-md: 12px;
  --radius-sm: 8px;
}"""
css = css.replace(old_root, new_root)

# Replace .btn-primary
css = re.sub(r"\.btn-primary \{.*?\}", """.btn-primary {
  background: linear-gradient(135deg, #0284c7, #38bdf8);
  color: var(--text-inverse);
  box-shadow: 0 4px 14px var(--primary-glow);
}""", css, flags=re.DOTALL)

# Fixed Glass Box Shadows
css = css.replace("0 8px 32px rgba(0, 0, 0, 0.3)", "0 8px 32px rgba(0, 0, 0, 0.08)")
css = css.replace("0 4px 15px rgba(0, 0, 0, 0.4)", "0 4px 20px rgba(0, 0, 0, 0.08)")

# Premium Features box
css = re.sub(r"\.premium-features \{.*?\}", """.premium-features {
  margin: 2rem 0;
  background: rgba(255, 255, 255, 0.6);
  padding: 1.5rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-glass);
}""", css, flags=re.DOTALL)

# Loaders and Navbars
css = css.replace("background: rgba(15, 17, 21, 0.9);", "background: rgba(240, 244, 248, 0.95);")
css = css.replace("background: rgba(15, 17, 21, 0.8);", "background: rgba(255, 255, 255, 0.85);")

# Background Opacity elements (old Violet or blue)
css = css.replace("rgba(139, 92, 246, 0.1)", "rgba(2, 132, 199, 0.1)")
css = css.replace("rgba(139, 92, 246, 0.15)", "rgba(2, 132, 199, 0.15)")
css = css.replace("rgba(139, 92, 246, 0.2)", "rgba(2, 132, 199, 0.2)")

css = css.replace("rgba(59, 130, 246, 0.1)", "rgba(2, 132, 199, 0.1)")
css = css.replace("rgba(59, 130, 246, 0.2)", "rgba(2, 132, 199, 0.2)")

# Input Background
css = re.sub(r"\.input-group input \{.*?\}", """.input-group input {
  width: 100%;
  padding: 0.8rem 1rem;
  background: #f8fafc;
  border: 1px solid var(--border-glass);
  border-radius: var(--radius-sm);
  color: var(--text-main);
  font-size: 1rem;
  transition: border-color 0.3s ease;
}""", css, flags=re.DOTALL)

# Bot Chat Bubbles
css = re.sub(r"\.message\.bot \.msg-bubble \{.*?\}", """.message.bot .msg-bubble {
  background: var(--bg-surface);
  border: 1px solid var(--border-glass);
  border-bottom-left-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
}""", css, flags=re.DOTALL)

# Hover interactions
css = css.replace("background: rgba(255, 255, 255, 0.05);", "background: rgba(0, 0, 0, 0.04);")

with open("style.css", "w") as f:
    f.write(css)

print("Light Theme applied!")
