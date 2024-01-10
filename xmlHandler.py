import os
import xml.etree.ElementTree as ET
import tkinter as tk

def load_xml_data(xml_file, fields):
    if os.path.exists(xml_file):
        tree = ET.parse(xml_file)
        root = tree.getroot()
        for child in root:
            if child.tag in fields:
                text = child.text if child.text is not None else ""
                if isinstance(fields[child.tag], tk.Entry):
                    fields[child.tag].delete(0, tk.END)
                    fields[child.tag].insert(0, text)
                elif isinstance(fields[child.tag], tk.Text):
                    fields[child.tag].delete("1.0", tk.END)
                    fields[child.tag].insert("1.0", text)
                elif isinstance(fields[child.tag], tk.BooleanVar):
                    fields[child.tag].set(text == 'True')
                # Add more conditions for other widget types if necessary
    else:
        print(f"No XML file found at {xml_file}. A new file will be created upon saving.")
        return False



def save_xml_data(xml_file, fields):
    root = ET.Element("Settings")
    for key, value in fields.items():
        element = ET.SubElement(root, key)
        # Directly set the text as the value is already a string or a boolean
        element.text = str(value)
    tree = ET.ElementTree(root)
    tree.write(xml_file)