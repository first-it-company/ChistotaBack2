from django import template

register = template.Library()


@register.filter  # type: ignore
def space_thousands(value):
    cleaned_value = "".join(
        filter(lambda char: char.isdigit() or char == "+", str(value))
    )
    value = int(cleaned_value)
    return f"{value:,}".replace(",", " ")
