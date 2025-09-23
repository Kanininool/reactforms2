def generate_prompt_from_schema(schema_json, schema_name="Employees"):
    prompt_lines = []
    prompt_lines.append("You are an expert SQL generator.\n")
    prompt_lines.append("Use the following PostgreSQL schema to generate SQL queries. Always include both the schema name and the table name in your SQL queries.\n")
    prompt_lines.append(f"Schema Name: {schema_name}\n")

    # Tables section
    prompt_lines.append("Tables:")
    for table_name, columns in schema_json.items():
        column_defs = ", ".join([f"{col} {dtype.upper()}" for col, dtype in columns.items()])
        prompt_lines.append(f"- {schema_name}.{table_name}({column_defs})")

    # Relationships section
    prompt_lines.append("\nRelationships:")
    relationships = set()
    for source_table, columns in schema_json.items():
        for col in columns:
            if col.lower() == "profileid":
                for target_table, target_columns in schema_json.items():
                    if "Id" in target_columns:
                        relationships.add(f"- {schema_name}.{source_table}.{col} → {schema_name}.{target_table}.Id")
    if relationships:
        prompt_lines.extend(sorted(relationships))
    else:
        prompt_lines.append("- No foreign key relationships inferred.")

    # Instructions
    prompt_lines.append("\nImportant:")
    prompt_lines.append(f"- Do not use just 'FROM {schema_name}'. Always use 'FROM {schema_name}.TableName'.")
    prompt_lines.append(f"- For example, use 'FROM {schema_name}.Personal_Data_Master' instead of 'FROM {schema_name}'.")
    prompt_lines.append(f"- Use the Location column in {schema_name}.Personal_Data_Master to filter by city if available.")

    return "\n".join(prompt_lines)
