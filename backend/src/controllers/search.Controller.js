export const searchController = async (req, res) => {
    try {

        const {input} = req.body;
        if(!input) {
            return res.status(400).json({message: "Input is required"});
        }

        const course = await Course.find({ispublished: true, $or: [{
            title: {$regex: input, $options: "i"},
            subTitle: {$regex: input, $options: "i"},
            description: {$regex: input, $options: "i"},
            category: {$regex: input, $options: "i"},
            level: {$regex: input, $options: "i"},

        }]});
        res.status(200).json(course);
        

    } catch (error) {
        res.status(500).json({message: "Internal server error"});
    }
}
