import os
import json
from typing import List, Dict, Any

def discover_modules(modules_dir: str = "modules") -> List[Dict[str, Any]]:
    """
    Scans a directory for valid modules (subdirectories with a manifest.json)
    and returns a list of their manifest data.
    """
    modules = []
    if not os.path.exists(modules_dir) or not os.path.isdir(modules_dir):
        print(f"Warning: Modules directory '{modules_dir}' not found.")
        return modules

    for module_id in os.listdir(modules_dir):
        module_path = os.path.join(modules_dir, module_id)
        if not os.path.isdir(module_path):
            continue

        manifest_path = os.path.join(module_path, "manifest.json")
        if not os.path.exists(manifest_path):
            continue

        try:
            with open(manifest_path, 'r') as f:
                manifest_data = json.load(f)
                # Add validation here later if needed (e.g., using Pydantic)
                # Use the directory name as the canonical module ID
                manifest_data['id'] = module_id
                modules.append(manifest_data)
                print(f"Discovered module: {manifest_data.get('name', module_id)}")
        except (json.JSONDecodeError, IOError) as e:
            print(f"Error loading manifest for module '{module_id}': {e}")
            continue

    return modules
