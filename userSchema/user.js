const {Schema,model}=require('mongoose');
const bcrypt= require('bcrypt');
const SALT_WORK_FACTOR=10;

const userSchema=new Schema({
    username:{
        type:String,
        required:true,
        lowercase:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
},{
    timestamps:true
});
userSchema.pre('save', async function (next) {
    try {
        if (!this.isModified('password')) return next();

        const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
        console.log("Salt generated:", salt);

        const hash = await bcrypt.hash(this.password, salt);
        console.log("Hashed password:", hash);

        this.password = hash;

        next(); 
    } catch (err) {
        next(err); 
    }
});

userSchema.methods.checkPassword=async function(plainPassword,cb){
    await bcrypt.compare(plainPassword,this.password,function(err,isMatch){
        if(err) return cb(err);
        else return cb(null,isMatch);
    });
}
const User=model('User',userSchema);

module.exports={userSchema,User};


