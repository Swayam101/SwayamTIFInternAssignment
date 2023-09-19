//  Third party package Imports
const { Snowflake } = require('@theinternetfolks/snowflake')

// Mongoose Model Imports
const Community = require("../models/community");
const Member = require('../models/member');
const Role = require('../models/role');

// Utility Imports
const asyncWrapper = require("../utils/asyncWrapper");
const Response = require('../utils/Response');


const slugifyString = (string, separator = '-') => {
    return string.toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, separator)
        .replace(/[^\w\-]+/g, '')
        .replace(/\_/g, separator)
        .replace(/\-\-+/g, separator)
        .replace(/\-$/g, '')
}

exports.createCommunity = asyncWrapper(async (req, res, next) => {

    //Creating Community
    const { name } = req.body;
    const slug = slugifyString(name);
    const user_id = req.user
    const id = Snowflake.generate()
    const community = await Community.create({ _id: id, name, slug, owner: user_id })

    // Adding Current User As Owner
    const member_id = Snowflake.generate();
    const role = await Role.findOne({ name: "Community Admin" }).select('id')
    await Member.create({ _id: member_id, community: community._id, user: user_id, role: role._id })
    const response = new Response(true, community);
    res.status(200).json(response)
}
)

exports.getAllCommunities = asyncWrapper(async (req, res, next) => {
    const { page, skip, limit } = req.paginate

    const communities = await Community.find().skip(skip).limit(limit);
    const total = await Community.count();

    const response = new Response(true, communities, {
        total, pages: Math.ceil(total / limit), page
    })
    res.send(response);
})

exports.getAllMembers = asyncWrapper(async (req, res, next) => {
    const { page, skip, limit } = req.paginate
    const { id } = req.params

    const members = await Member.find({ community: id }).sort({ createdAt: 1 }).skip(skip).limit(limit);
    const total = await Member.count({ community: id });

    const response = new Response(true, members, {
        total, pages: Math.ceil(total / limit), page
    })
    res.json(response)
})

exports.getOwner = asyncWrapper(async (req, res, next) => {
    const { page, limit, skip } = req.paginate
    const owner = req.user

    const communities = await Community.find({ owner }).sort({ createdAt: 1 }).skip(skip).limit(limit);
    const total = await Community.count({ owner })

    const response = new Response(true, communities, {
        total, pages: Math.ceil(total / limit), page
    })
    res.send(response)
})

exports.getMemberOf = asyncWrapper(async (req, res, next) => {
    const { page, limit, skip } = req.paginate
    const member = req.user;

    const members = await Member.find({ user: member }).skip(skip).limit(limit).populate({
        path: 'community', populate: {
            path: 'owner',
            select: '_id name'
        }
    })

    const communities = members.map(member => member.community)
    const response = new Response(true, communities, {
        total: communities.length, pages: Math.ceil(communities.length / limit), page
    })
    res.json(response)
})