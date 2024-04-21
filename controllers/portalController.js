import portalModel from "../models/portalSchema.js";

const getPortalData = async (req, res) => {
    const data = req.body;
    try {
        const portalData = await portalModel.find();
        res.status(200).json(portalData);
    } catch (error) {
        console.log(error);
        res.status(400).json("internal server error");
    }
}

const setPortalData = async (req, res) => {
    const data = req.body;
    const portalID = req.params.id;
    console.log(data)
    try {
        await portalModel.findByIdAndUpdate(portalID, data);

        const updatedPortalData = await portalModel.findById(portalID);

        res.status(200).json(updatedPortalData);
    } catch (error) {
        console.log(error);
        res.status(400).json("internal server error");
    }
}


export { getPortalData, setPortalData };