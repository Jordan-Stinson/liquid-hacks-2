import fs from "fs";
import path from "path";

export default (req, res) => {
  const dirRelativeToPublicFolder = "public/images/playerCards";

  const dir = path.resolve(dirRelativeToPublicFolder);

  const filenames = fs.readdirSync(dir);
  console.log(filenames);
  const images = filenames.map((name) =>
    path.join("/", dirRelativeToPublicFolder, name)
  );

  res.statusCode = 200;
  res.json(images);
};
