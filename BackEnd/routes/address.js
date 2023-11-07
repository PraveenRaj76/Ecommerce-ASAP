const express = require('express');
const router = express.Router();
const {database} = require('../config/helpers');
const {add} = require("nodemon/lib/rules");

/* GET ALL ADDRESSES*/
router.get(`/`, (req, res) => {
    database.table('addresses as a')
        .join([
            {
                table: `users as u`,
                on: `u.id = a.user_id`
            }
        ])
        .withFields(['a.id', 'a.address', 'a.city', 'a.state', 'a.country', 'a.pincode', 'a.phone', 'u.id as userId'])
        .sort({id: 1})
        .getAll()
        .then(address => {
            if(address.length > 0) {
                res.status(200).json(address);
            } else {
                res.json({message: `No addresses found`});
            }
        }).catch(err => console.log(err));
});

/* GET A SINGLE ADDRESS */
router.get(`/:userid`, (req, res) => {

    const userId = req.params.userid;

    database.table('addresses as a')
        .join([
            {
                table: `users as u`,
                on: `u.id = a.user_id`
            }
        ])
        .withFields(['a.id', 'a.address', 'a.city', 'a.state', 'a.country', 'a.pincode', 'a.phone', 'u.id as userId'])
        .filter({'u.id': userId})
        .sort({id: 1})
        .getAll()
        .then(address => {
            if(address.length > 0) {
                res.status(200).json(address);
            } else {
                res.json({message: `No address found with userId ${userId}`});
            }
        }).catch(err => console.log(err));
});

/* INSERT NEW ADDRESS */
router.post(`/new`, async (req, res) => {
    let {userId, addresses} = req.body;

    let user = await database.table('addresses').filter({user_id: userId}).get();

    if (user) {
        if (userId !== null & userId > 0) {
            database.table('addresses')
                .filter({user_id: userId})
                .update({
                    user_id: userId,
                    address: addresses.address,
                    city: addresses.city,
                    state: addresses.state,
                    country: addresses.country,
                    pincode: addresses.pincode,
                    phone: addresses.phone
                })
                .then(result => {
                    res.json({
                        message: `Updated the Address successfully`,
                        success: true,
                        address_id: user.id,
                        addresses: addresses,
                        user_id: userId
                    })
                }).catch(err => console.log(err));
        } else {
            res.json({message: `Updating address failed`, success: false});
        }
    } else {
        if(userId !== null & userId > 0) {
            database.table('addresses')
                .insert({
                    user_id : userId,
                    address: addresses.address,
                    city: addresses.city,
                    state: addresses.state,
                    country: addresses.country,
                    pincode: addresses.pincode,
                    phone: addresses.phone
                })
                .then(newAddressId => {
                    if(newAddressId.insertId > 0) {
                        res.json({
                            message: `New Address successfully added`,
                            success: true,
                            address_id: newAddressId.insertId,
                            addresses: addresses,
                            user_id: userId
                        })
                    } else {
                        res.json({message: `New address failed while adding address details`, success: false});
                    }
                }).catch(err => console.log(err));
        } else {
            res.json({message: `Adding new address failed`, success: false});
        }
    }

})

module.exports = router;
