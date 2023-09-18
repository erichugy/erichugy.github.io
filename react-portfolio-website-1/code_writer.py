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
        jsx_file.write(
            f"""
import React from 'react'
import './{component_name}.css'

const {component_name.capitalize()} = () => {{
return (
    <div>{component_name.capitalize()}</div>
)
}}

export default {component_name.capitalize()}
"""
)
        
def createComponents(components):
    # component_name = input("Enter the component name: ")

    component_names = components
    for component_name in component_names:
        create_component(component_name)
        print(f"Component '{component_name}' created successfully.")

def update_jsx_file(js_file_path, component_names):
    # Read the content of the JSX file
    with open(js_file_path, 'r') as jsx_file:
        jsx_content = jsx_file.read()

    # Define import statements for the new components
    import_statements = [
        f"import {component_name.capitalize()} from './components/{component_name}/{component_name.capitalize()}'"
        for component_name in component_names
    ]

    # Define the JSX elements to insert into the return statement
    jsx_elements = [
        f"<{component_name.capitalize()} />"
        for component_name in component_names
    ]

    # Add the import statements and JSX elements to the content
    updated_content = jsx_content.replace(
        "const App = () => {",
        '\n'.join(import_statements) + "\nconst App = () => {"
    )

    updated_content = updated_content.replace(
        "<Header />",
        "<Header />" + '\n      '.join(jsx_elements) + "\n"
    )

    # Write the updated content back to the JSX file
    with open(js_file_path, 'w') as jsx_file:
        jsx_file.write(updated_content)

def importComponentsToApp(components = [
    # "nav",
    # "about", 
    # "experience",
    # "services",
    # "portfolio", 
    # "testimonials",
    # "contact", 
    # "footer", 
    ]):
    jsx_file_path = r"C:\Users\Eric Huang\Desktop\Coding\website\react-portfolio-website-1\src\App.jsx"
    component_names = components
    update_jsx_file(jsx_file_path, component_names)
 

if __name__ == "__main__":
    importComponentsToApp()
