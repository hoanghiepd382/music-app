import { Request, Response } from "express"
import Topic from "../../models/topic.model";
import Song from "../../models/song.model";
import Singer from "../../models/singer.model";
import favouriteSong from "../../models/favourite-songs.model";


export const list = async (req: Request, res: Response)=>{
    const slugTopic = req.params.slugTopic;
    const topic = await Topic.findOne({
        slug: slugTopic
    });
    const songList = await Song.find({
        topicId: topic.id,
        deleted: false,
        status: "active"
    }).select("avatar title slug singerId like");

    for (const song of songList) {
        const singer = await Singer.findOne({
            _id: song.singerId,
            deleted: false,
            status: "active"
        });
        song["infoSinger"] = singer;
    }
    res.render("client/pages/songs/index", {
        pageTitle: topic.title,
        songs: songList
    });
}

export const detail = async (req: Request, res: Response)=>{
    const slugSong = req.params.slugSong;
    const song = await Song.findOne({
        slug: slugSong
    });
    const singer = await Singer.findOne({
        _id: song.singerId
    }).select("fullName");
    const topic = await Topic.findOne({
        _id: song.topicId
    }).select("title");
    
    const favouriteSongs = await favouriteSong.findOne({
        songId: song.id
    });
    song["isFavourite"] = favouriteSongs? true : false;

    res.render("client/pages/songs/detail", {
        pageTitle: song.title,
        song: song,
        singer: singer,
        topic: topic
    });
}

export const like = async (req: Request, res:Response)=>{
    const typeLike = req.params.typeLike;
    const id = req.params.id;

    const song = await Song.findOne({
        _id: id,
        deleted: false,
        status: "active"
    });
    const newLike = typeLike == "like"? song.like + 1 : song.like - 1;
    await Song.updateOne({
            _id: id
        },{
            like: newLike
        })
    res.json({
        code: 200,
        message: "Thành công",
        like: newLike
    })
}

export const favourite = async (req: Request, res: Response) =>{
    const type = req.params.typeFavourite;
    const songId = req.params.id;

    switch (type) {
        case "favourite":
            const existFavouriteSong = await favouriteSong.findOne({
                _id: songId
            });
            if (!existFavouriteSong){
                const newFavouriteSong = new favouriteSong({
                    songId: songId
                });
                await newFavouriteSong.save();
            }
            break;
        case "unfavourite":
            await favouriteSong.deleteOne({
                songId: songId 
            });
        default:
            break;
    }
    res.json({
        code: 200,
        message: "Thành công"
    })
}