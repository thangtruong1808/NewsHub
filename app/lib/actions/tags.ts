"use server";

import { query } from "../db/db";
import { Tag, TagFormData } from "../definition";

interface QueryResult {
  insertId?: number;
  [key: string]: any;
}

export async function getTags() {
  try {
    const result = await query(`
      SELECT id, name, description, color, 
             DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') as created_at,
             DATE_FORMAT(updated_at, '%Y-%m-%d %H:%i:%s') as updated_at
      FROM Tags
      ORDER BY name ASC
    `);

    if (result.error) {
      console.error("Error fetching tags:", result.error);
      return { data: null, error: result.error };
    }

    // Convert the dates to proper Date objects
    const tags = (result.data as any[]).map((tag) => ({
      ...tag,
      created_at: new Date(tag.created_at),
      updated_at: new Date(tag.updated_at),
    })) as Tag[];

    return { data: tags, error: null };
  } catch (error) {
    console.error("Error fetching tags:", error);
    return { data: null, error: "Failed to fetch tags" };
  }
}

export async function getTagById(id: number) {
  try {
    const tags = await query<Tag[]>(
      `
      SELECT * FROM Tags
      WHERE id = ?
    `,
      [id]
    );
    return { data: tags[0] || null, error: null };
  } catch (error) {
    console.error("Error fetching tag:", error);
    return { data: null, error: "Failed to fetch tag" };
  }
}

export async function createTag(tagData: TagFormData) {
  try {
    const result = (await query<QueryResult>(
      `
      INSERT INTO Tags (name, description, color)
      VALUES (?, ?, ?)
    `,
      [tagData.name, tagData.description, tagData.color]
    )) as QueryResult;

    if (result.insertId) {
      const { data: tag } = await getTagById(
        result.insertId
      );
      return { data: tag, error: null };
    }

    return { data: null, error: "Failed to create tag" };
  } catch (error) {
    console.error("Error creating tag:", error);
    return { data: null, error: "Failed to create tag" };
  }
}

export async function updateTag(
  id: number,
  tagData: TagFormData
) {
  try {
    await query(
      `
      UPDATE Tags
      SET name = ?, description = ?, color = ?
      WHERE id = ?
    `,
      [tagData.name, tagData.description, tagData.color, id]
    );

    const { data: tag } = await getTagById(id);
    return { data: tag, error: null };
  } catch (error) {
    console.error("Error updating tag:", error);
    return { data: null, error: "Failed to update Tag" };
  }
}

export async function deleteTag(id: number) {
  try {
    await query(
      `
      DELETE FROM Tags
      WHERE id = ?
    `,
      [id]
    );
    return { data: true, error: null };
  } catch (error) {
    console.error("Error deleting tag:", error);
    return { data: null, error: "Failed to delete Tag" };
  }
}
