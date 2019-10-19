const Router = require('koa-router')
const router = new Router()
const koaBody = require('koa-body')
const db = require('../models/db');
require('dotenv').config()

// Index page
router.get('/', async (ctx, next) => {
  try {
    let social = db.get('social').value(),
      skills = db.get('skills').value(),
      products = db.get('products').value()
    await ctx.render('pages/index', {
      social: social,
      skills: skills,
      products: products
    })
  } catch(err) {
    console.log(err)
  }
})

router.post('/', koaBody(), async (ctx, next) => {
  try {
    const {name, email, message } = ctx.request.body
    db.get('feedback')
      .push ({
        name: name,
        email: email,
        message: message
      })
      .write()
      //   req.flash('msgemail', 'Sending was successful')
    ctx.redirect('/')
  } catch(err) {
    console.log(err)
  }
})

// Login page
router.get('/login', async (ctx, next) => {
  try {
    let social = db.get('social').value()
    await ctx.render('pages/login', {
      social: social,
      // msglogin: ctx.flash('msglogin')[0]
    })
  } catch(err) {
    console.log(err)
  }
})

router.post('/login', koaBody(), async (ctx, next) => {
  try {
    const { email, password } = ctx.request.body
    if(email === process.env.EMAIL && password === process.env.PASS) {
        // req.flash('msglogin', 'Authorization was successful')
        ctx.redirect('/admin')
    } else {
      // ctx.flash('msglogin', 'Wrong email or password')
      ctx.redirect('/login')
    }
  } catch(err) {
    console.log(err)
  }
})

// // Admin page
router.get('/admin', async (ctx, next) => {
  try {
    await ctx.render('pages/admin')
  } catch(err) {
    console.log(err)
  }
})
// router.get('/admin', (req, res, next) => {
//   res.render('pages/admin', {
//     msgskill: req.flash('msgskill')[0],
//     msgfile: req.flash('msgfile')[0]
//   });
// });

router.post('/admin/skills', koaBody(), async (ctx, next) => {
  try {
    const { age, concerts, cities, years } = ctx.request.body
    if(age !=='') {
      db.get('skills')
        .find({id: 1})
        .assign({number: Number(age)})
        .write()
    }
    if(concerts !=='') {
      db.get('skills')
        .find({id: 2})
        .assign({number: Number(concerts)})
        .write()
    }
    if(cities !=='') {
      db.get('skills')
        .find({id: 3})
        .assign({number: Number(cities)})
        .write()
    }
    if(years !=='') {
      db.get('skills')
        .find({id: 4})
        .assign({number: Number(years)})
        .write()
    }
    // req.flash('msgskill', 'Skills was changed')
    ctx.redirect('/admin')
  } catch(err) {
    console.log(err)
  }
});

router.post('/admin/upload', async (ctx, next) => {
  try {
    await koaBody
    const { name, price } = ctx.request.body
    if(ctx.request.files !== undefined && name !=='' && price !=='') {
      db.get('products')
        .push({
          src: ctx.request.files.photo.path,
          name: name,
          price: price
        })
        .write()
      // req.flash('msgfile', 'Product was uploaded successfuly')
      ctx.redirect('/admin')
    } else {
      // req.flash('msgfile', 'You must select a file and fill in all the fields')
      ctx.redirect('/admin')
    }
  } catch(err) {
    console.log(err)
  }
})

module.exports = router;