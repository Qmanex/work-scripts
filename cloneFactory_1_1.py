import os
import shutil

inputFolderPath = ""
outputFolderPath = ""
bIB = ""
bEB = ""

# Define a list of invalid characters for filenames
invalid_chars = ['/', '*', ':', '?', '"', '<', '>', '|']

def run_clone_factory(input_folder, output_folder, index_list, ean_list, override_image_list, bIndexBox,bEanBox):

    global inputFolderPath, outputFolderPath, bIB, bEB

    bIB = bIndexBox = bIndexBox == 'True'
    bEB = bEanBox = bEanBox == 'True'

    # Check if the input folder exists
    if not os.path.exists(input_folder):
        print(f"Input folder not found: {input_folder}")
        exit(1)

    inputFolderPath = input_folder

    # Check if the output folder is provided, if not, create it in the parent directory of the input folder
    if not output_folder.strip():
        parent_dir = os.path.dirname(input_folder)
        output_folder = os.path.join(parent_dir, "output")

    # Check if the output folder exists, if not, create it
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    outputFolderPath = output_folder

    image_names = [file_name[:-4] for file_name in os.listdir(input_folder) if file_name.endswith(".jpg") or file_name.endswith(".png")]
    image_mapping = {}
    image_processed = []
    image_processed = processSymbols(image_names)

    for origin_image_name, processed_name in zip(image_names, image_processed):
        image_mapping[origin_image_name] = image_names
        image_mapping[processed_name] = image_processed

    # Prepare lists for processing
    index_names = [line.strip() for line in index_list if line.strip()]
    index_names = processSymbols(index_names)
    ean_numbers = [line.strip() for line in ean_list if line.strip()]
    override_dict = {line.split(',')[0].strip(): line.split(',')[1].strip() for line in override_image_list if line.strip()}

    # Create a composite list of index and EAN
    eanCompositeList = [f"{index}_{ean}" for index, ean in zip(index_names, ean_numbers)]

    # Now index_names and ean_numbers are ready to be used in the rest of your script

    # Check if the number of index names matches the number of EAN numbers
    #if bEanBox and (len(index_names) != len(ean_numbers)):
    #    print(">>> checking value of EAN BOX: "+bEanBox)
    #    raise ValueError("Number of index names does not match the number of EAN numbers")

    # Debug: Print the list of image names and dictionaries
    #print("Image names found:", image_names)
    #print("Override dictionary:", override_dict)
    #print("Index names:", index_names)
    #print("EAN numbers:", ean_numbers)
    print("composite list Ean-index:", eanCompositeList)

    #print("Sample image names:", image_names[:5])
    #print("Sample index names:", index_names[:5])
    #print("Sample override dictionary:", dict(list(override_dict.items())[:5]))

    # Process images

    for image_name in image_names:
        print("Checking image:", image_name)  # Debug print
        processed_Name = processSymbols(image_name)

        if processed_Name in override_dict:
            print("Override image found:", image_name)
            process_override_image(image_name, override_dict[image_name])
        elif any(processed_Name.startswith(index) for index in index_names):
            print("Index match found for:", image_name)
            process_index_ean_image(image_name, eanCompositeList)
        else:
            print("No matching case found for:", image_name)
            process_index_ean_image(image_name, eanCompositeList)
        '''
        if image_name in index_names and bEanBox:
            print("Index + EAN image found:", image_name)
            ean = ean_numbers[index_names.index(image_name)]
            process_index_ean_image(image_name, ean, bIndexBox, bEanBox)
        elif image_name in index_names:
            print("Index only image found:", image_name)
            process_index_image(image_name, bIndexBox, bEanBox)
        '''
        

    '''
    # Process images
    for image_name in image_names:
        print(">>>\r checking:") 
       
        match image_name:
            case name if name in override_dict:
                # Process override images
                print(">>>>>\l overide:")
                process_override_image(name, override_dict[name])
            case name if name in index_names and bEanBox:
                # Process images with index and EAN
                print(">>>>>\l index + ean:")
                ean = ean_numbers[index_names.index(name)]
                process_index_ean_image(name, ean, bIndexBox, bEanBox)
            case name if name in index_names:
                # Process images with index only
                print(">>>>>\l index only:")
                process_index_image(name, bIndexBox, bEanBox)
            case _:
                print(">>>>>\l process default index only:")
    '''
'''
    for image_name in processed_name:
        print("Checking image:", image_name)  # Debug print
        if image_name in override_dict:
            print("Override image found:", image_name)
            process_override_image(image_name, override_dict[image_name])
        elif any(image_name.startswith(index) for index in index_names):
            print("Index match found for:", image_name)
            processed_name = image_mapping[image_name]
            process_index_ean_image(image_name, eanCompositeList)
        else:
            print("No matching case found for:", image_name)
            process_index_ean_image(image_name, eanCompositeList)
'''
    # Process override image list
    #override_dict = {}
    #for line in override_image_list:
    #    if line.strip():  # Check if line is not empty
    #        index, image = line.strip().split(',')
    #        override_dict[index] = image

def processSymbols(array_list):
    processed_list = []
    for symbol in array_list:
        symbol = symbol.replace("–", "-")
        symbol = symbol.replace("/", "_")

        processed_list.append(symbol)

    return processed_list

def process_override_image(image_name):
    # Logic to process override images
    pass

def process_index_image(image_name):
    # Logic to process images with index only
    pass

def process_index_ean_image(image_name, eanCompositeList):
    for composite in eanCompositeList:
            # Split the composite string into index and EAN
            parts = composite.rsplit('_',1)
            if len(parts) == 2:
                sIndex, sEan = parts
                # Check if the image_name matches the index exactly or is followed by a digit
                if sIndex.startswith(image_name) and (sIndex == image_name or sIndex[len(image_name)] in ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']):
                    #print("Match found for:", image_name, "in index:", sIndex)  # Debug print
                    new_name = generateName(sIndex, sEan)
                    new_name = sanitize_filename(new_name)

                    # Rename and move the image to the output folder
                    source_path = os.path.join(inputFolderPath, f"{image_name}.jpg")
                    dest_path = os.path.join(outputFolderPath, new_name)
                    shutil.copyfile(source_path, dest_path)
            else:
                print(f"Invalid format in eanCompositeList: {composite}")

def generateImage(imageName,fileName):          

    # Rename and move the image to the output folder
    source_path = os.path.join(inputFolderPath, f"{imageName}.jpg")
    dest_path = os.path.join(outputFolderPath, fileName)
    

    # Debugging print statements
    #print("Source path:", inputFolderPath, source_path)
    #print("Destination path:", outputFolderPath, dest_path)
    
    shutil.copyfile(source_path, dest_path)

# Function to format the index buffer
def format_index_buffer(raw_data):
    # Splits the input data by newlines and formats it
    return [f'"{line.strip()}"' for line in raw_data.strip().split('\n') if line.strip()]

# Function to format the EAN buffer
def format_ean_buffer(raw_data):
    # Splits the input data by newlines and formats it
    return [f'{line.strip()},' for line in raw_data.strip().split('\n') if line.strip()]

def sanitize_filename(filename):
    for char in invalid_chars:
        filename = filename.replace(char, '_')
    return filename

def generateName(sIndex, iEan,bIndexBox=True,bEanBox=False):
    if(bIB is not None):
        bIndexBox = bIB
    if(bEB is not None):    
        bEanBox = bEB

    new_name = ""

    match(bIndexBox, bEanBox):
        case (True, False):
            #print("case 1")
            new_name = f"{sIndex}.jpg"
            pass
        case (False, True):
            #print("case 2")
            new_name = f"{iEan}.jpg"
            pass
        case _:
            #print("case 3")
            new_name = f"{sIndex}_{str(iEan)}.jpg"
            pass

    print(new_name)
    return new_name