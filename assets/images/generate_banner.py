
import base64

# Define paths
logo_path = r"c:\Users\HP\Downloads\webs\PAGINA WEB ARQUI\sitio-web\assets\images\logo.png"
banner_path = r"c:\Users\HP\Downloads\webs\PAGINA WEB ARQUI\sitio-web\assets\images\banner_horizontal.svg"

# Read the logo file and encode to base64
with open(logo_path, "rb") as image_file:
    encoded_string = base64.b64encode(image_file.read()).decode('utf-8')

# Construct the SVG content
# Using format string to embed the base64 data
svg_content = f"""<svg width='1200' height='300' viewBox='0 0 1200 300' xmlns='http://www.w3.org/2000/svg'>
  <rect width='1200' height='300' fill='#FFFFFF' />
  <g transform='translate(50, 25)'>
    <image href='data:image/png;base64,{encoded_string}' x='0' y='0' height='250' width='250' preserveAspectRatio='xMidYMid meet' />
  </g>
  <g transform='translate(350, 50)'>
      <text x='0' y='100' font-family='Segoe UI, Roboto, Helvetica, Arial, sans-serif' font-weight='900' font-size='100' fill='#000000' letter-spacing='4'>ROER</text>
      <text x='5' y='160' font-family='Segoe UI, Roboto, Helvetica, Arial, sans-serif' font-weight='600' font-size='22' fill='#000000' letter-spacing='1'>
          REGULARIZACIÓN Y OPTIMIZACIÓN DE ESPACIOS RESIDENCIALES
      </text>
      <line x1='0' y1='190' x2='750' y2='190' stroke='#000000' stroke-width='4' />
  </g>
</svg>"""

# Write the SVG content to the file
with open(banner_path, "w", encoding="utf-8") as svg_file:
    svg_file.write(svg_content)

print(f"Successfully generated SVG banner at {banner_path}")
