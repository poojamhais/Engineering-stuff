"""Generate PDF Report for Ohm's Law - matching the reference format"""
from fpdf import FPDF
import os

BASE = r"c:\Users\sanji\Downloads\Presentation"
ASSETS = os.path.join(BASE, "assets")

class Report(FPDF):
    def __init__(self):
        super().__init__('P', 'mm', 'A4')
        self.set_auto_page_break(auto=False)
        self._page_num_text = None

    def page_border(self):
        self.set_draw_color(0,0,0)
        self.set_line_width(0.8)
        self.rect(10, 10, 190, 277)
        self.set_line_width(0.3)
        self.rect(12, 12, 186, 273)

    def header_block(self):
        self.set_font('Helvetica', 'B', 11)
        self.set_text_color(0,0,0)
        self.cell(0, 6, "Matoshri Education Society's", align='C', new_x='LMARGIN', new_y='NEXT')
        self.set_font('Helvetica', 'B', 14)
        self.set_text_color(0,128,0)
        self.cell(0, 7, "MIT POLYTECHNIC AND ENGINEERING", align='C', new_x='LMARGIN', new_y='NEXT')
        self.set_font('Helvetica', 'B', 11)
        self.set_text_color(0,0,0)
        self.cell(0, 6, "Yeola", align='C', new_x='LMARGIN', new_y='NEXT')
        self.set_font('Helvetica', '', 9)
        self.set_text_color(80,80,80)
        self.cell(0, 5, "Department of Electronics and Telecommunication Engineering", align='C', new_x='LMARGIN', new_y='NEXT')
        self.ln(3)
        self.set_draw_color(0,128,0)
        self.set_line_width(0.5)
        self.line(20, self.get_y(), 190, self.get_y())
        self.ln(4)

    def write_page_num(self, text):
        self.set_y(272)
        self.set_font('Helvetica', '', 10)
        self.set_text_color(0,0,0)
        self.cell(0, 10, text, align='C')

    def new_content_page(self):
        self.add_page()
        self.page_border()
        self.set_xy(15, 18)
        self.header_block()

pdf = Report()

# Track content page number separately
content_pg = [0]

def start_page(pdf, title=None, is_content=False):
    pdf.new_content_page()
    if is_content:
        content_pg[0] += 1
    if title:
        pdf.set_font('Helvetica', 'B', 18)
        pdf.set_text_color(0,0,0)
        pdf.cell(0, 10, title, align='C', new_x='LMARGIN', new_y='NEXT')
        pdf.ln(4)

def write_body(pdf, lines):
    pdf.set_font('Helvetica', '', 12)
    pdf.set_text_color(0,0,0)
    for line in lines:
        if pdf.get_y() > 260:
            break
        if line.startswith("##"):
            pdf.ln(3)
            pdf.set_font('Helvetica', 'B', 14)
            pdf.set_text_color(0,128,0)
            pdf.set_x(20)
            pdf.cell(0, 8, line[2:].strip(), new_x='LMARGIN', new_y='NEXT')
            pdf.set_font('Helvetica', '', 12)
            pdf.set_text_color(0,0,0)
            pdf.ln(2)
        elif line.startswith("* "):
            pdf.set_x(25)
            pdf.multi_cell(165, 6, line)
            pdf.ln(1)
        else:
            pdf.set_x(20)
            pdf.multi_cell(170, 7, line)
            pdf.ln(2)

def add_image(pdf, img_name, max_w=80):
    path = os.path.join(ASSETS, img_name)
    if os.path.exists(path):
        remaining = 265 - pdf.get_y()
        if remaining > 30:
            pdf.ln(3)
            pdf.set_x(65)
            try:
                pdf.image(path, w=min(max_w, 80), h=min(remaining - 5, 60))
            except:
                pass

# ════════════════════════════════════════════
# PRE-CONTENT PAGES
# ════════════════════════════════════════════

# PAGE 1: Institute Vision & Mission
start_page(pdf)
pdf.set_font('Helvetica', 'BU', 16)
pdf.set_text_color(0,128,0)
pdf.cell(0, 10, "Vision", align='C', new_x='LMARGIN', new_y='NEXT')
pdf.set_font('Helvetica', '', 11)
pdf.set_text_color(0,0,0)
pdf.set_x(20)
pdf.multi_cell(170, 6, "To develop skilled and competent professionals in Electronics and Telecommunication Engineering who contribute to the technological advancement of society.")
pdf.ln(6)
pdf.set_font('Helvetica', 'BU', 16)
pdf.set_text_color(0,128,0)
pdf.cell(0, 10, "Mission", align='C', new_x='LMARGIN', new_y='NEXT')
pdf.set_font('Helvetica', '', 11)
pdf.set_text_color(0,0,0)
for m in [
    "To impart quality technical education through well-equipped laboratories and experienced faculty.",
    "To encourage students to develop practical skills and innovative thinking.",
    "To prepare students for successful careers in industry, research, and entrepreneurship.",
    "To promote ethical values and social responsibility among students."
]:
    pdf.set_x(25); pdf.multi_cell(165, 6, "- " + m); pdf.ln(2)
pdf.write_page_num("i")

# PAGE 2: Dept Vision & Mission
start_page(pdf)
pdf.set_font('Helvetica', 'B', 14)
pdf.set_text_color(0,0,0)
pdf.cell(0, 10, "DEPARTMENT OF ELECTRONICS AND TELECOMMUNICATION ENGINEERING", align='C', new_x='LMARGIN', new_y='NEXT')
pdf.ln(4)
pdf.set_font('Helvetica', 'BU', 16)
pdf.set_text_color(0,128,0)
pdf.cell(0, 10, "Vision", align='C', new_x='LMARGIN', new_y='NEXT')
pdf.set_font('Helvetica', '', 11)
pdf.set_text_color(0,0,0)
pdf.set_x(20)
pdf.multi_cell(170, 6, "To become a center of excellence in Electronics and Telecommunication Engineering education, producing industry-ready professionals.")
pdf.ln(6)
pdf.set_font('Helvetica', 'BU', 16)
pdf.set_text_color(0,128,0)
pdf.cell(0, 10, "Mission", align='C', new_x='LMARGIN', new_y='NEXT')
pdf.set_font('Helvetica', '', 11)
pdf.set_text_color(0,0,0)
for m in [
    "To provide strong fundamental knowledge in electronics and telecommunication engineering principles.",
    "To develop problem-solving abilities and analytical skills.",
    "To foster research aptitude and encourage innovative project development.",
    "To build industry-academia partnerships for better employability."
]:
    pdf.set_x(25); pdf.multi_cell(165, 6, "- " + m); pdf.ln(2)
pdf.write_page_num("ii")

# PAGE 3: Cover Page
start_page(pdf)
pdf.ln(12)
pdf.set_font('Helvetica', 'B', 13)
pdf.set_text_color(0,0,0)
pdf.cell(0, 8, "A Project Report On", align='C', new_x='LMARGIN', new_y='NEXT')
pdf.ln(6)
pdf.set_font('Helvetica', 'B', 28)
pdf.set_text_color(80,0,120)
pdf.cell(0, 14, '"OHM\'S LAW"', align='C', new_x='LMARGIN', new_y='NEXT')
pdf.ln(12)
pdf.set_font('Helvetica', 'B', 12)
pdf.set_text_color(0,0,0)
pdf.cell(0, 7, "Submitted By:", align='C', new_x='LMARGIN', new_y='NEXT')
pdf.ln(4)
pdf.set_font('Helvetica', 'B', 13)
pdf.set_text_color(200,0,0)
students = [("1", "Pooja Santosh Mhais"), ("2", "Rutuja Ramesh Gaikwad"), ("3", "Shubham Madhukar Gaikwad")]
for roll, name in students:
    pdf.cell(0, 8, f"{roll}. {name}", align='C', new_x='LMARGIN', new_y='NEXT')
pdf.ln(10)
pdf.set_font('Helvetica', 'B', 12)
pdf.set_text_color(0,0,0)
pdf.cell(0, 7, "Under The Guidance Of:", align='C', new_x='LMARGIN', new_y='NEXT')
pdf.set_font('Helvetica', 'B', 13)
pdf.set_text_color(0,0,180)
pdf.cell(0, 8, "Miss. BELDAR G.N.", align='C', new_x='LMARGIN', new_y='NEXT')
pdf.ln(12)
pdf.set_font('Helvetica', '', 11)
pdf.set_text_color(100,60,0)
pdf.cell(0, 6, "Department of Electronics and Telecommunication Engineering", align='C', new_x='LMARGIN', new_y='NEXT')
pdf.set_text_color(0,0,0)
pdf.cell(0, 6, "Academic Year: 2025-2026", align='C', new_x='LMARGIN', new_y='NEXT')
pdf.write_page_num("iii")

# PAGE 4: Certificate
start_page(pdf)
pdf.set_font('Helvetica', 'B', 10)
pdf.cell(0, 6, "ANNEXURE A", align='C', new_x='LMARGIN', new_y='NEXT')
pdf.ln(6)
pdf.set_font('Helvetica', 'B', 22)
pdf.set_text_color(0,128,0)
pdf.cell(0, 12, "CERTIFICATE", align='C', new_x='LMARGIN', new_y='NEXT')
pdf.ln(8)
pdf.set_font('Helvetica', '', 12)
pdf.set_text_color(0,0,0)
pdf.set_x(20)
pdf.multi_cell(170, 7, 'This is to certify that the project report entitled "OHM\'S LAW" has been successfully completed by the following students of First Year Electronics and Telecommunication Engineering:')
pdf.ln(4)
pdf.set_font('Helvetica', 'B', 12)
for roll, name in students:
    pdf.set_x(50)
    pdf.cell(0, 8, f"{roll}. {name}", new_x='LMARGIN', new_y='NEXT')
pdf.ln(4)
pdf.set_font('Helvetica', '', 12)
pdf.set_x(20)
pdf.multi_cell(170, 7, 'Under the guidance of Miss. Beldar G.N. at MIT Polytechnic and Engineering, Yeola during the academic year 2025-2026.')
pdf.ln(25)
pdf.set_font('Helvetica', 'B', 10)
pdf.set_x(18)
for c in ["Guide", "HOD", "External Examiner", "Principal"]:
    pdf.cell(42, 6, c, align='C')
pdf.write_page_num("iv")

# PAGE 5: Acknowledgement
start_page(pdf)
pdf.set_font('Helvetica', 'B', 18)
pdf.set_text_color(0,0,0)
pdf.cell(0, 12, "ACKNOWLEDGEMENT", align='C', new_x='LMARGIN', new_y='NEXT')
pdf.ln(8)
pdf.set_font('Helvetica', '', 12)
for p in [
    "We would like to express our sincere gratitude to our project guide Miss. Beldar G.N. for her valuable guidance, constant encouragement, and support throughout the completion of this project.",
    "We are also thankful to the Head of the Department of Electronics and Telecommunication Engineering and the Principal of MIT Polytechnic and Engineering, Yeola, for providing us with the necessary facilities and resources.",
    "We extend our heartfelt thanks to all the faculty members of the Electronics and Telecommunication Engineering department for their cooperation and assistance.",
    "Finally, we are grateful to our families and friends for their unwavering support and motivation during this project work."
]:
    pdf.set_x(20); pdf.multi_cell(170, 7, p); pdf.ln(4)
pdf.ln(10)
pdf.set_font('Helvetica', 'B', 12)
for n in ["Pooja Santosh Mhais", "Rutuja Ramesh Gaikwad", "Shubham Madhukar Gaikwad"]:
    pdf.set_x(120); pdf.cell(0, 7, n, new_x='LMARGIN', new_y='NEXT')
pdf.write_page_num("v")

# PAGE 6: Index
start_page(pdf)
pdf.set_font('Helvetica', 'B', 18)
pdf.set_text_color(0,128,0)
pdf.cell(0, 12, "INDEX", align='C', new_x='LMARGIN', new_y='NEXT')
pdf.ln(6)
pdf.set_font('Helvetica', 'B', 12)
pdf.set_text_color(0,0,0)
pdf.set_x(20)
pdf.cell(20, 10, "Sr. No", border=1, align='C')
pdf.cell(120, 10, "Contents", border=1, align='C')
pdf.cell(30, 10, "Page No", border=1, align='C')
pdf.ln()
pdf.set_font('Helvetica', '', 11)
for sr, content, pg in [
    ("1", "Abstract", "1"), ("2", "Introduction", "2"),
    ("3", "Statement of Ohm's Law", "3"), ("4", "The Ohm's Law Formula (V = IR)", "4"),
    ("5", "Water Analogy", "5"), ("6", "V-I Characteristic Graph", "6"),
    ("7", "Solved Examples", "7"), ("8", "Practical Applications", "8"),
    ("9", "Limitations of Ohm's Law", "9"), ("10", "Conclusion", "10"),
    ("11", "References", "11"),
]:
    pdf.set_x(20)
    pdf.cell(20, 9, sr, border=1, align='C')
    pdf.cell(120, 9, "  " + content, border=1)
    pdf.cell(30, 9, pg, border=1, align='C')
    pdf.ln()
pdf.write_page_num("vi")

# ════════════════════════════════════════════
# CONTENT PAGES (No blank pages!)
# ════════════════════════════════════════════

# 1. Abstract
start_page(pdf, "Abstract", is_content=True)
write_body(pdf, [
    "Ohm's Law is one of the most fundamental principles in electronics and telecommunication engineering and physics. It establishes a linear relationship between voltage, current, and resistance in an electrical circuit.",
    "This project report provides a comprehensive study of Ohm's Law, including its mathematical formulation (V = IR), its physical interpretation through the water analogy, practical applications in circuit design, and its limitations when applied to non-linear devices.",
    "The report is intended for first-year engineering students to build a strong foundational understanding of electrical circuit analysis. Interactive simulations and solved numerical examples are included to reinforce the theoretical concepts.",
    "The key objective of this project is to present Ohm's Law in an engaging and interactive manner, making it accessible to all students regardless of their prior background in physics or electronics."
])
pdf.write_page_num(str(content_pg[0]))

# 2. Introduction
start_page(pdf, "Introduction", is_content=True)
write_body(pdf, [
    "Electricity is an essential part of modern life, powering everything from household appliances to industrial machinery. Understanding the basic laws governing electrical circuits is crucial for any engineering student.",
    "Ohm's Law, discovered by German physicist Georg Simon Ohm in 1827, is the cornerstone of circuit theory. It states that the current flowing through a conductor between two points is directly proportional to the voltage across the two points, provided the temperature remains constant.",
    "Georg Simon Ohm published his findings in his book 'Die galvanische Kette, mathematisch bearbeitet' (The Galvanic Circuit Investigated Mathematically). Despite initial skepticism from the scientific community, his work was eventually recognized as a foundational contribution to electronics and telecommunication engineering.",
    "This report explores Ohm's Law in depth, from its basic statement to its practical applications and limitations."
])
add_image(pdf, "georg_ohm.png")
pdf.write_page_num(str(content_pg[0]))

# 3. Statement of Ohm's Law
start_page(pdf, "Statement of Ohm's Law", is_content=True)
write_body(pdf, [
    '"The current flowing through a conductor is directly proportional to the potential difference (voltage) applied across its ends, provided the physical conditions such as temperature remain constant."',
    "Mathematically, this is expressed as:",
    "V = I x R",
    "Where:",
    "* V = Voltage (Potential Difference) measured in Volts (V)",
    "* I = Current measured in Amperes (A)",
    "* R = Resistance measured in Ohms (Ohm)",
    "This relationship can be rearranged to find any of the three quantities:",
    "* I = V / R  (to find current)",
    "* R = V / I  (to find resistance)",
    "The law applies to ohmic conductors, which exhibit a linear V-I characteristic."
])
pdf.write_page_num(str(content_pg[0]))

# 4. The Ohm's Law Formula
start_page(pdf, "The Ohm's Law Formula (V = IR)", is_content=True)
write_body(pdf, [
    "## The V-I-R Triangle",
    "The Ohm's Law triangle is a visual tool used to remember the three forms of the formula. Simply cover the variable you want to find, and the remaining two variables show the formula.",
    "## Understanding Each Variable",
    "* Voltage (V): Think of it as the electrical 'pressure' that drives electrons through the circuit. A higher voltage means more force pushing the electrons.",
    "* Current (I): This is the rate of electron flow, similar to the flow rate of water in a pipe. More current means more electrons passing a point per second.",
    "* Resistance (R): This opposes current flow, like friction in a pipe. Higher resistance means less current for the same voltage.",
    "## Power Relationship",
    "Combining Ohm's Law with the power formula P = VI gives us additional useful relationships:",
    "* P = I^2 x R  (Power in terms of current and resistance)",
    "* P = V^2 / R  (Power in terms of voltage and resistance)"
])
add_image(pdf, "circuit_diagram.png")
pdf.write_page_num(str(content_pg[0]))

# 5. Water Analogy
start_page(pdf, "Water Analogy", is_content=True)
write_body(pdf, [
    "The water analogy is the most intuitive way to understand Ohm's Law for beginners.",
    "## Voltage = Water Pressure",
    "Just as water pressure pushes water through pipes, voltage pushes electrons through a conductor. A higher water tank (more pressure) is analogous to a higher voltage battery.",
    "## Current = Water Flow Rate",
    "The amount of water flowing through a pipe per second is analogous to electrical current. More water flow equals more current.",
    "## Resistance = Pipe Constriction",
    "A narrow section in a pipe restricts water flow, just as electrical resistance restricts current flow. A wider pipe allows more flow, equivalent to lower resistance.",
    "This analogy helps students visualize abstract electrical concepts using everyday experience with water systems."
])
add_image(pdf, "water_analogy.png")
pdf.write_page_num(str(content_pg[0]))

# 6. V-I Characteristic Graph
start_page(pdf, "V-I Characteristic Graph", is_content=True)
write_body(pdf, [
    "The V-I (Voltage-Current) characteristic graph is a fundamental tool in circuit analysis.",
    "## For Ohmic Conductors",
    "When voltage is plotted on the X-axis and current on the Y-axis, an ohmic conductor produces a straight line passing through the origin. The slope of this line equals 1/R.",
    "## Effect of Different Resistances",
    "* A low resistance (e.g., 10 Ohm) produces a steep line (high current for given voltage).",
    "* A medium resistance (e.g., 20 Ohm) produces a moderately sloped line.",
    "* A high resistance (e.g., 50 Ohm) produces a gentle slope (low current).",
    "## Key Observation",
    "The linear nature of the V-I graph proves that the conductor follows Ohm's Law. Non-ohmic devices like diodes produce curved V-I characteristics."
])
pdf.write_page_num(str(content_pg[0]))

# 7. Solved Examples
start_page(pdf, "Solved Examples", is_content=True)
write_body(pdf, [
    "## Example 1: Finding Current",
    "Given: V = 24V, R = 8 Ohm",
    "Solution: Using I = V/R = 24/8 = 3 Amperes",
    "## Example 2: Finding Voltage",
    "Given: I = 5A, R = 12 Ohm",
    "Solution: Using V = I x R = 5 x 12 = 60 Volts",
    "## Example 3: Finding Resistance",
    "Given: V = 120V, I = 0.5A",
    "Solution: Using R = V/I = 120/0.5 = 240 Ohms",
    "## Example 4: Power Calculation",
    "Given: V = 230V, R = 100 Ohm",
    "Solution: I = V/R = 230/100 = 2.3A; P = V x I = 230 x 2.3 = 529 Watts"
])
pdf.write_page_num(str(content_pg[0]))

# 8. Practical Applications
start_page(pdf, "Practical Applications", is_content=True)
write_body(pdf, [
    "Ohm's Law is applied extensively across electrical and electronics engineering.",
    "## 1. LED Circuit Design",
    "When connecting an LED to a power supply, Ohm's Law is used to calculate the required series resistor value to limit current and prevent the LED from burning out.",
    "## 2. Power Supply Design",
    "Engineers use Ohm's Law to determine current draw and power dissipation in voltage regulator circuits, ensuring safe operation of electronic devices.",
    "## 3. Household Electrical Wiring",
    "Electricians calculate wire gauge requirements and fuse ratings using Ohm's Law to ensure safe home electrical installations.",
    "## 4. Troubleshooting Electrical Faults",
    "Technicians diagnose faulty components by measuring voltage drops across circuit elements and comparing them to expected values using Ohm's Law."
])
add_image(pdf, "applications.png")
pdf.write_page_num(str(content_pg[0]))

# 9. Limitations
start_page(pdf, "Limitations of Ohm's Law", is_content=True)
write_body(pdf, [
    "While Ohm's Law is fundamental, it has important limitations:",
    "## 1. Non-Linear Devices",
    "Diodes, transistors, and LEDs do not obey Ohm's Law. Their V-I relationship is non-linear and depends on the device characteristics.",
    "## 2. Temperature Dependence",
    "The resistance of most conductors changes with temperature. Ohm's Law assumes constant temperature, which is not always practical.",
    "## 3. High-Frequency AC Circuits",
    "In AC circuits with capacitors and inductors, impedance (not just resistance) must be considered. Ohm's Law in its basic form is insufficient.",
    "## 4. Semiconductors",
    "Materials like silicon and germanium have complex V-I characteristics that vary with doping concentration and temperature.",
    "## 5. Superconductors",
    "At extremely low temperatures, some materials exhibit zero resistance, making the concept of Ohm's Law inapplicable."
])
pdf.write_page_num(str(content_pg[0]))

# 10. Conclusion
start_page(pdf, "Conclusion", is_content=True)
write_body(pdf, [
    "Ohm's Law (V = IR) is the most fundamental and widely used law in electronics and telecommunication engineering. Through this project, we have explored its definition, mathematical formulation, physical interpretation through the water analogy, and practical applications.",
    "The key takeaways from this study are:",
    "* Voltage, current, and resistance are linearly related in ohmic conductors.",
    "* The V-I-R triangle provides a quick reference for solving circuit problems.",
    "* The water analogy makes abstract electrical concepts intuitive and accessible.",
    "* Ohm's Law has widespread applications from LED circuits to household wiring.",
    "* The law has limitations when applied to non-linear devices and non-standard conditions.",
    "Understanding Ohm's Law is essential for any engineering student as it forms the basis for more advanced topics like Kirchhoff's Laws, Thevenin's Theorem, and AC circuit analysis."
])
pdf.write_page_num(str(content_pg[0]))

# 11. References
start_page(pdf, "References", is_content=True)
write_body(pdf, [
    "1. Ohm, G.S. (1827). Die galvanische Kette, mathematisch bearbeitet.",
    "2. Boylestad, R.L. (2015). Introductory Circuit Analysis, 13th Edition. Pearson Education.",
    "3. Hughes, E. (2012). Electrical and Electronic Technology, 10th Edition. Pearson.",
    "4. Hayt, W.H. & Kemmerly, J.E. (2011). Engineering Circuit Analysis, 8th Edition. McGraw-Hill.",
    "5. NCERT Physics Textbook, Class 12, Chapter 3: Current Electricity.",
    "6. Khan Academy - Ohm's Law Tutorial (www.khanacademy.org)",
    "7. All About Circuits - Ohm's Law (www.allaboutcircuits.com)"
])
pdf.write_page_num(str(content_pg[0]))

# Save
output = os.path.join(BASE, "Ohms_Law_Report.pdf")
pdf.output(output)
print(f"PDF saved: {output}")
print(f"Total pages: {pdf.page_no()}")
