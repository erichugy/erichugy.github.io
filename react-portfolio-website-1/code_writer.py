import os

def create_component(component_name):
    # Create a directory with the component name
    component_dir = os.path.join(
        r"C:\Users\Eric Huang\Desktop\Coding\website\react-portfolio-website-1\src\components",
        component_name
    )
    os.makedirs(component_dir, exist_ok=True)

    # Create a .css file with the same component name
    css_file_path = os.path.join(component_dir, f"{component_name}.css")
    with open(css_file_path, 'w') as css_file:
        pass  # Empty CSS file

    # Create a .jsx file with the component name (capitalized)
    jsx_file_path = os.path.join(component_dir, f"{component_name.capitalize()}.jsx")
    with open(jsx_file_path, 'w') as jsx_file:
        jsx_file.write(f"""
import React from 'react'
import './{component_name}.css'

const {component_name.capitalize()} = () => {{
return (
    <div>{component_name.capitalize()}</div>
)
}}

export default {component_name.capitalize()}
""")

if __name__ == "__main__":
    # component_name = input("Enter the component name: ")
    component_names = ['header', 'portfolio', 'services', 'footer']
    for component_name in component_names:
        create_component(component_name)
        print(f"Component '{component_name}' created successfully.")
