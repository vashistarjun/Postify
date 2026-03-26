const Todo = require('../model/todo')
//user
exports.createTodo = async (req, res) => {
    try {
        const { title, description, } = req.body;;
        const photo = req.file ? req.file.path : ""
        const createTodo = await Todo.create({
            title,
            description,
            photo,
            user:req.user.id        // yaha link hora h todo user ke saath
        })
        return res.status(201).json({
            success: true,
            message:"todo created successfully"
        })
    }
    catch (err) {
        console.log(error)
        return res.status(500).json({
            success: "false",
            message:"server error"
        })
    }
}
//user
exports.deleteTodo = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedTodo = await Todo.findOneAndDelete({
            _id: id,
            user: req.user.id
        });

        if (!deletedTodo) {
            return res.status(404).json({
                success: false,
                message: "Todo not found or not authorized"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Todo deleted successfully"
        });

    } catch (error) {
        
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};
//user
exports.updateTodo = async (req,res) => {
    try {
        const { id } = req.params;
        const { title, description } = req.body;
        const photo = req.file ? req.file.path : undefined;
        const fieldtoUpdate = {}
        if (title !== undefined) {
            fieldtoUpdate.title=title
        }
        if (description !== undefined) {
            fieldtoUpdate.description=description
        }
        if (photo !== undefined) {
            fieldtoUpdate.photo=photo
        }
        const updatetodo = await Todo.findOneAndUpdate({
            _id:id , user:req.user.id
        }, 
            fieldtoUpdate,
            { new: true, runValidators: true }
        
        )
        
        
        if (!updatetodo) {
            return res.status(400).json({
                success: "false",
                message: "todo does not exist or not authorize"
            })
        }
        return res.status(200).json({
            success: true,
            message: "todo is updated"
        })
    }
    catch (error) {
        return res.status(500).json({
            message: "server error",
            success:false
        })
    }
}
//admin
exports.getAllTodo = async (req,res) => {
    try {
        const alldata = await Todo.find().populate("user", "email name").sort({
            createdAt:-1
        });
        if (alldata.length==0) {
            return res.status(404).json({
                message:"no data available"
            })
        }
        return res.status(200).json({
            success: true,
            data:alldata
            
        })
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message:"server error"
        })
    }
}
//user
exports.getMyTodo = async (req,res) => {
    try {
        const id = req.user.id;
        if (!id) {
            return res.status(403).json({
                success: false,
                message: "user need to sign in first"
            })
        }
        const data = await Todo.find({ user: req.user.id }).sort({createdAt:-1})
        if (data.length==0) {
            return res.status(404).json({
                success: false,
                message: "nothing to show"
            })
        }
        return res.status(200).json({
            success: true,
            data: data
        })
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "server erorr"
        })
    }

}
//admin
exports.pendingTodos = async (req,res) => {
    try {
        const data = await Todo.find({status:"pending"}).populate("user", "email name");
        if (data.length == 0) {
            return res.status(200).json(
                {
                    success: true,
                    data: [],
                    message: "no pending todos"
                }
            )
        }
        return res.status(200).json({
            success: true,
            data:data
        })
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message:"server error"
        })
    }
}
//admin
exports.getRejectedTodo = async (req,res) => {
    try {
        const data = await Todo.find({
            status:"rejected"
        }).populate("user", "email name");
        if (data.length == 0) {
            return res.status(200).json({
                success: true,
                data: [],
                message:"no rejected todos"
            })
        }
        return res.status(200).json({
            success: true,
            data:data
        })
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message:"server error"
        })
    }
}
//admin
exports.getTodoById = async (req,res) => {
    try {
        const { id } = req.query;
        const data = await Todo.findById(id).populate("user", "email name");
        if (!data) {
            return res.status(200).json({
                success: true,
                message:"todo not found"
            })
        }
        return res.status(200).json({
            success: true,
            data:data
        })
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message:"server error"
        })
    }
    
}

//admin
exports.approveTodo = async (req,res) => {
    try {
        const { id } = req.params;
        const updatedTodo = await Todo.findByIdAndUpdate(
            id,
            { status: "approve" },
            { new: true }
        );
        if (!updatedTodo) {
            return res.status(404).json({
                success: false,
                message: "Todo not found"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Todo approved",
            data: updatedTodo
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message:"server error"
        })
    }
}

//admin
exports.rejectTodo = async (req,res) => {
    try {
        const { id } = req.params;
        const updatedTodo = await Todo.findByIdAndUpdate(
            id,
            { status: "rejected" },
            { new: true }
        );
        if (!updatedTodo) {
            return res.status(404).json({
                success: false,
                message: "Todo not found"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Todo rejected",
            data: updatedTodo
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message:"server error"
        })
    }
}

