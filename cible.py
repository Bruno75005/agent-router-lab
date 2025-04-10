import os

def collect_project_files_content(source_dir, output_file):
    """
    Parcourt le dossier source_dir et ses sous-dossiers, collecte le contenu
    de tous les fichiers ayant l'une des extensions voulues (.ejs, .js, .html,
    .ts, .tsx, .json, .md) et les écrit dans output_file.

    Exclut les dossiers "node_modules", ".git", "env" et le fichier "package-lock.json".

    :param source_dir: Chemin vers le dossier mon-generateur-projet
    :param output_file: Chemin du fichier de sortie (ex: results.txt)
    """
    # Dossiers à exclure
    excluded_dirs = {"node_modules", ".git", "venv", "public", "chroma", ".next"}
    # Fichiers spécifiques à exclure
    excluded_files = {"package-lock.json"}
    # Extensions recherchées
    wanted_extensions = (".ejs", ".js", ".html", ".ts", ".tsx", ".json", ".md")

    file_count = 0  # Compteur de fichiers ajoutés

    try:
        with open(output_file, "w", encoding="utf-8") as outfile:
            outfile.write(f"### Résumé des fichiers trouvés dans {source_dir} ###\n\n")

            for root, dirs, files in os.walk(source_dir):
                # Supprime de la liste les dossiers qu'on ne souhaite pas parcourir
                dirs[:] = [d for d in dirs if d not in excluded_dirs]

                for file in files:
                    # Vérifie l'extension ET le nom du fichier
                    if file.endswith(wanted_extensions) and file not in excluded_files:
                        file_path = os.path.join(root, file)
                        try:
                            with open(file_path, "r", encoding="utf-8", errors="ignore") as infile:
                                content = infile.read()

                            # Écrit dans results.txt
                            outfile.write(f"===== {file_path} =====\n\n")
                            outfile.write(content)
                            outfile.write("\n\n" + "=" * 80 + "\n\n")

                            file_count += 1
                            print(f"✅ Ajouté : {file_path}")
                        except Exception as e:
                            print(f"❌ Erreur lors de la lecture de {file_path} : {e}")

            outfile.write(f"\n### {file_count} fichiers enregistrés avec succès. ###\n")

        print(f"\n✅ Tous les fichiers ont été copiés dans {output_file} ({file_count} fichiers).")
    except Exception as e:
        print(f"❌ Erreur lors de l'écriture dans {output_file}: {e}")


# Exemple d'utilisation
if __name__ == "__main__":
    source_directory = r"D:\agent-router-lab"  # À personnaliser
    output_file_path = "results.txt"

    collect_project_files_content(source_directory, output_file_path)
