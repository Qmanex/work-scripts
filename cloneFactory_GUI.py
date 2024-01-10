import tkinter as tk
from tkinter import filedialog, scrolledtext
import tkinter.messagebox as messagebox
import cloneFactory_1_1
import xmlHandler

fields = {}  # Your fields dictionary defined in the GUI script

def select_folder(entry_field):
    folder_path = filedialog.askdirectory()  # Opens the directory selection dialog
    if folder_path:
        entry_field.delete(0, tk.END)
        entry_field.insert(0, folder_path)

def reset_text_field(text_field):
    text_field.delete('1.0', tk.END)

def update_example_name(last_clicked):
    if not generate_index_name.get() and not generate_ean_name.get():
        # If both checkboxes are false, set the other one to true
        if last_clicked == "index":
            generate_ean_name.set(True)
        else:
            generate_index_name.set(True)

    # Update example name based on checkbox states
    example_name = ""
    if generate_index_name.get():
        example_name += "index"
    if generate_ean_name.get():
        example_name += "_5905033300347" if example_name else "5905033300347"
    example_name += ".jpg"
    label_example_name.config(text=f"Example: {example_name}")

def start_cloning(fields):
    # Update fields with current values from the GUI
    updated_fields = {
        'inputFolder': entry_input_folder.get(),
        'outputFolder': entry_output_folder.get(),
        'index': text_index.get("1.0", tk.END).strip(),
        'ean': text_ean.get("1.0", tk.END).strip(),
        'overrideImage': text_override_image.get("1.0", tk.END).strip(),
        'bIndex': str(generate_index_name.get()),  # Convert boolean to string
        'bEan': str(generate_ean_name.get())       # Convert boolean to string
    }

    # Extract the input and output folder paths
    input_folder = fields['inputFolder'].get()
    output_folder = fields['outputFolder'].get()

    # Check if the input folder path is empty
    if not input_folder.strip():
        messagebox.showerror("Error", "Input folder path cannot be empty.")
        return  # Stop the function if the input path is empty

    index_list = updated_fields['index'].split('\n')
    ean_list = updated_fields['ean'].split('\n')
    override_image_list = updated_fields['overrideImage'].split('\n')

    if fields['bEan'].get() and len(index_list) != len(ean_list):
        messagebox.showerror("Error", "The number of indexes and EAN codes must be the same.")
        return  # Stop the function if the lengths are not equal


    # Save data to XML
    xmlHandler.save_xml_data(xml_file, updated_fields)

    # Call cloneFactory with the current values
    cloneFactory_1_1.run_clone_factory(updated_fields['inputFolder'], updated_fields['outputFolder'], 
                                       index_list, ean_list, override_image_list, 
                                       updated_fields['bIndex'], updated_fields['bEan'])

# Create the main window
root = tk.Tk()
root.title("Clone Factory GUI")
root.geometry("400x700")  # Increased height to accommodate new buttons

# Input Folder Path
label_input_folder = tk.Label(root, text="Input Folder Path:")
label_input_folder.pack()
entry_input_folder = tk.Entry(root, width=50)
entry_input_folder.pack()
fields['inputFolder'] = entry_input_folder
button_input_folder = tk.Button(root, text="Browse", command=lambda: select_folder(entry_input_folder))
button_input_folder.pack()

# Output Folder Path
label_output_folder = tk.Label(root, text="Output Folder Path:")
label_output_folder.pack()
entry_output_folder = tk.Entry(root, width=50)
entry_output_folder.pack()
fields['outputFolder'] = entry_output_folder
button_output_folder = tk.Button(root, text="Browse", command=lambda: select_folder(entry_output_folder))
button_output_folder.pack()

# Index List
label_index = tk.Label(root, text="Index List:")
label_index.pack()
text_index = scrolledtext.ScrolledText(root, height=5, width=50)
text_index.pack()
fields['index'] = text_index
button_reset_index = tk.Button(root, text="Reset", command=lambda: reset_text_field(text_index))
button_reset_index.pack()

# EAN List
label_ean = tk.Label(root, text="EAN List:")
label_ean.pack()
text_ean = scrolledtext.ScrolledText(root, height=5, width=50)
text_ean.pack()
fields['ean'] = text_ean
button_reset_ean = tk.Button(root, text="Reset", command=lambda: reset_text_field(text_ean))
button_reset_ean.pack()

# Override Image List
label_override_image = tk.Label(root, text="Override Image List:")
label_override_image.pack()
text_override_image = scrolledtext.ScrolledText(root, height=5, width=50)
text_override_image.pack()
fields['overrideImage'] = text_override_image
button_reset_override_image = tk.Button(root, text="Reset", command=lambda: reset_text_field(text_override_image))
button_reset_override_image.pack()

# Generate Index Name Checkbox
generate_index_name = tk.BooleanVar(value=True)
checkbox_generate_index = tk.Checkbutton(root, text="Generate Index Name", variable=generate_index_name, command=lambda: update_example_name("index"))
checkbox_generate_index.pack()
fields['bIndex'] = generate_index_name

# Generate EAN Name Checkbox
generate_ean_name = tk.BooleanVar(value=False)
checkbox_generate_ean = tk.Checkbutton(root, text="Generate EAN Name", variable=generate_ean_name, command=lambda: update_example_name("ean"))
checkbox_generate_ean.pack()
fields['bEan'] = generate_ean_name

# Example Name Label
label_example_name = tk.Label(root, text="Example: index.jpg")
label_example_name.pack()
fields['exampleName'] = label_example_name

# Start Button (not functional yet)
#start_button = tk.Button(root, text="Start Cloning", height=2, command=start_cloning)
start_button = tk.Button(root, text="Start Cloning", height=2, command=lambda: start_cloning(fields))
start_button.pack(pady=10)

# Load data from XML
xml_file = "settings.xml"
xmlHandler.load_xml_data(xml_file, fields)

# Run the application
root.mainloop()
