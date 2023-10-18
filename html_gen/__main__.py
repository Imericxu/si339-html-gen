import json
import subprocess
from pathlib import Path

import jinja2
from jinja2 import Environment, PackageLoader, Template, select_autoescape

from html_gen import STATIC_PATH

OUT_DIR: Path = Path("build").resolve()


def render_template_to_file(env: Environment, name: str, **kwargs):
    template: Template = env.get_template(f"{name}.html")
    out_path = OUT_DIR / f"{name}.html"
    with out_path.open("w") as f:
        f.write(template.render(**kwargs))


def main():
    env = Environment(
        loader=PackageLoader("html_gen", "templates"),
        autoescape=select_autoescape(),
        trim_blocks=True,
        lstrip_blocks=True,
        undefined=jinja2.StrictUndefined,
    )

    # Load pets data
    with (STATIC_PATH / "data" / "pets.json").open() as f:
        pets = json.load(f)
    # Load travel data
    with (STATIC_PATH / "data" / "travel.json").open() as f:
        travel = json.load(f)
    # Load recipes data
    with (STATIC_PATH / "data" / "recipes.json").open() as f:
        recipes = json.load(f)

    # Make output directory
    OUT_DIR.mkdir(exist_ok=True)

    # Render templates
    print("Rendering templates...")
    render_template_to_file(env, "index", **pets)
    render_template_to_file(env, "travel", **travel)
    render_template_to_file(env, "recipes", **recipes)

    # Generate CSS from SCSS
    print("Running Sass...")
    subprocess.run(
        ["npx", "sass", f"{str(STATIC_PATH / 'css')}:{str(OUT_DIR / 'css')}"]
    )

    # Pass generated CSS through Autoprefixer
    print("Running Autoprefixer...")
    subprocess.run(
        [
            "npx",
            "postcss",
            "--use",
            "autoprefixer",
            "--replace",
            str(OUT_DIR / "css" / "*.css"),
        ],
    )

    # Copy JS
    print("Copying JS...")
    subprocess.run(
        [
            "rsync",
            "-av",
            "--update",
            "--delete",
            "--exclude",
            ".*",
            str(STATIC_PATH / "js"),
            str(OUT_DIR),
        ]
    )

    # Format HTML, CSS, and JS with Prettier
    print("Running Prettier...")
    subprocess.run(
        [
            "npx",
            "prettier",
            "--ignore-path",
            ".prettierignore",
            "--write",
            str(OUT_DIR / "**" / "*.{css,html,js}"),
        ]
    )

    # Copy images if modified or missing
    # Images are in `STATIC_PATH / "images"`
    # Destination is `OUT_DIR / "images"`
    print("Copying images...")
    subprocess.run(
        [
            "rsync",
            "-av",
            "--update",
            "--delete",
            "--exclude",
            ".*",
            str(STATIC_PATH / "images"),
            str(OUT_DIR),
        ]
    )

    print("Done!")


if __name__ == "__main__":
    main()
