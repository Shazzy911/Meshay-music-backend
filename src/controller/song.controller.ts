import { Request, Response } from "../types/file.type";
import { decode } from "base64-arraybuffer";
import prisma from "../lib/prisma.config";
import { IFile } from "../types/file.type";
import supabase from "../lib/supabaseClient";

type IMulterFiles = {
  [fieldname: string]: IFile[];
};

const getAllSong = async (req: Request, resp: Response) => {
  try {
    let Song = await prisma.song.findMany();

    if (!Song || Song.length === 0) {
      resp.status(404).json({ message: "Song not Found" });
    }

    resp.status(200).json(Song);
  } catch (error) {
    resp.status(500).json({ error });
  }
};

const createSong = async (req: Request, resp: Response) => {
  try {
    const { artistId, albumId, title, duration, genre, releaseDate } = req.body;

    if (
      !title ||
      !duration ||
      !genre ||
      !releaseDate ||
      !artistId ||
      !albumId
    ) {
      resp.status(404).json({ message: "All fields are required" });
    }
    console.log(typeof duration);

    let Numduration = Number(req.body.duration);
    console.log(typeof Numduration);
    console.log(artistId, albumId, title, duration, genre, releaseDate);
    const file = req.files as { [fieldname: string]: IFile[] };
    const imageFile = file["img"][0];
    const songFile = file["songUrl"][0];
    // If we reach here, we have both files safely
    console.log("Image File:", imageFile.originalname);
    console.log("Song File:", songFile.originalname);

    // decode file buffer to base64
    const imgFileBase64 = decode(imageFile.buffer.toString("base64"));
    const songFileBase64 = decode(songFile.buffer.toString("base64"));

    // Convert releaseDate to ISO string format (with milliseconds and Z for UTC)
    const isoReleaseDate = new Date(releaseDate).toISOString();

    // upload the imageFile to supabase
    const { data: imageUpload, error: imageError } = await supabase.storage
      .from("music-store")
      .upload("images/song/" + imageFile.originalname, imgFileBase64, {
        contentType: imageFile.mimetype,
        cacheControl: "3600",
        upsert: false,
      });
    // upload the imageFile to supabase
    const { data: songUpload, error: songError } = await supabase.storage
      .from("music-store")
      .upload("audio/" + songFile.originalname, songFileBase64, {
        contentType: songFile.mimetype,
        cacheControl: "3600",
        upsert: false,
      });
    // Handle storage upload errors
    if (imageError || songError) {
      const errorMessage = imageError ? "image" : "song";
      resp.status(404).json({
        message: `Error uploading ${errorMessage} to Supabase`,
        error: imageError?.message || songError?.message,
      });
    }

    // Check if imageUpload is not null
    if (songUpload !== null && imageUpload !== null) {
      const imageUrl = supabase.storage
        .from("music-store")
        .getPublicUrl(imageUpload.path);
      const songUrl = supabase.storage
        .from("music-store")
        .getPublicUrl(songUpload.path);

      const songData = await prisma.song.create({
        data: {
          artistId,
          albumId,
          title,
          duration: Numduration,
          genre,
          releaseDate: isoReleaseDate,
          img: imageUrl?.data?.publicUrl || "",
          songUrl: songUrl?.data?.publicUrl || "",
        },
      });

      resp.status(201).json({
        success: true,
        result: songData,
        message: "Song Information Saved Successfully",
      });
    } else {
      // Handle the case where storageData is null
      resp.status(404).json({
        message: "Error uploading file, Song data is null",
      });
    }
  } catch (error) {
    resp.status(500).json({ error, message: "Error Saving Song Information" });
  }
};

/// Song By Id.
const getSongById = async (req: Request, resp: Response) => {
  try {
    const SongId = req.params.id;

    let data = await prisma.song.findUnique({
      where: {
        id: SongId,
      },
    });
    if (!data) {
      resp.status(404).json({ message: "Song not found" });
    } else {
      resp
        .status(200)
        .json({ data: data, message: "Song Infomation Successfully Found" });
    }
  } catch (error) {
    resp
      .status(500)
      .json({ error, message: "Song Info Not Updated Successfully" });
  }
};

const updateSongById = async (req: Request, resp: Response) => {
  try {
    const SongId = req.params.id;
    const body = req.body;

    const existingSong = await prisma.song.findUnique({
      where: {
        id: SongId,
      },
    });

    if (!existingSong) {
      resp.status(404).json({ message: "Song Not Found" });
    }

    let updatedData = {
      ...body,
    };

    // let data = await Song.updateOne({ SongId }, updateSong);
    const Song = await prisma.song.update({
      where: { id: SongId },
      data: updatedData,
    });
    resp
      .status(200)
      .json({ data: Song, message: "Song Info Updated Successfully" });
  } catch (error) {
    resp
      .status(500)
      .json({ error, message: "Song Info Not Updated Successfully" });
  }
};

const deleteSongById = async (req: Request, resp: Response) => {
  try {
    const SongId = req.params.id;

    const existingSong = await prisma.song.findUnique({
      where: {
        id: SongId,
      },
    });

    if (!existingSong) {
      resp.status(404).json({ message: "Song Not Found" });
    }

    const Song = await prisma.song.delete({
      where: { id: SongId },
    });
    resp.status(200).json({ Song, message: "Song deleted successfully" });
  } catch (error) {
    resp.status(500).json({ error, message: "Song Not Found" });
  }
};
export { getAllSong, createSong, getSongById, updateSongById, deleteSongById };

// {
//   "artistId": "cm29dgzp1001y3uneq03diuj1",
//   "albumId": "cm29dhzb000203unelhxwrjus",
//   "title": "Telus Jesus Freak",
//   "duration": 205,
//   "img": "http://example.com",
//   "genre": "Pop",
//   "songUrl": "http://song.com",
//   "releaseDate": "2021-03-20T00:00:00Z"
// }
