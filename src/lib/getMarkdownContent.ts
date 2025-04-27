import path from "path";
import {promises as fs} from "fs";

export async function getMarkdownContent(fileName: string): Promise<string> {
    const filePath = path.join(process.cwd(), "src", "content", fileName);
    const fileContent = await fs.readFile(filePath, "utf-8");
    return fileContent;
}
