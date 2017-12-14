const express = require('express');
const router = express.Router();

// Bring in Models
const Article = require('../models/article');

// Add Route
router.get('/add', function (req, res) {
    res.render('add_article', {
        title: 'Add Article'
    });
});

// Add Submit POST Route
router.post('/add', function (req, res) {
    // Validators
    req.checkBody('title', 'title is required').notEmpty();
    req.checkBody('author', 'author is required').notEmpty();
    req.checkBody('body', 'body is required').notEmpty();

    // Get Errors
    const errors = req.validationErrors();
    if(errors) {
        res.render('add_article', {
            title: 'Add Article',
            errors: errors
        });
    } else {
        const article = new Article();
        article.title = req.body.title;
        article.author = req.body.author;
        article.body = req.body.body;
        article.save(function (err) {
            if(err) {
                console.log(err);
            } else {
                req.flash('success', 'Article added');
                res.redirect('/');
            }
        })
    }
});

// Load Edit Form
router.get('/edit/:id', function (req, res) {
    Article.findById(req.params.id, function (err, article) {
        res.render('edit_article', {
            title: 'Edit Article',
            article: article
        });
    });
});

// Update Submit POST Route
router.post('/edit/:id', function (req, res) {
    const article = {};
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;

    const query = {_id: req.params.id};


    Article.update(query, article, function (err) {
        if(err) {
            console.log(err);
        } else {
            res.redirect('/');
        }
    })
});

// Delete Article
router.delete('/:id', function (req, res) {
    const query = {_id: req.params.id};

    Article.remove(query, function (err) {
        if(err) {
            console.log(err);
        } else {
            res.send('Success')
        }
    })
});

// Get Single Article
router.get('/:id', function (req, res) {
    Article.findById(req.params.id, function (err, article) {
        res.render('article', {
            article: article
        });
    });
});

module.exports = router;