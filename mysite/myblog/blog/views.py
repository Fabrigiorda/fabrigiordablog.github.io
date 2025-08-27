from django.views import generic
from .models import Post
from django.shortcuts import render
from .models import Post
from .forms import CommentForm
from django.shortcuts import render, get_object_or_404, redirect
from django.http import HttpResponseRedirect

class PostList(generic.ListView):
    queryset = Post.objects.filter(status=1).order_by('-created_on')
    template_name = 'index.html'

class PostDetail(generic.DetailView):
    model = Post
    template_name = 'blog/post_detail.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        post = self.get_object()
        comments = post.comments.filter(active=True)
        comment_form = CommentForm()

        context['post'] = post
        context['comments'] = comments
        context['comment_form'] = comment_form
        context['new_comment'] = False
        return context

    def post(self, request, *args, **kwargs):
        post = self.get_object()
        comment_form = CommentForm(data=request.POST)

        if comment_form.is_valid():
            new_comment = comment_form.save(commit=False)
            new_comment.post = post
            new_comment.save()
            return self.get(request, new_comment=True)

        context = self.get_context_data()
        context['comment_form'] = comment_form
        return self.render_to_response(context)

def index(request):
    post_list = Post.objects.filter(status=1).order_by('-created_on')
    return render(request, 'blog/index.html', {'post_list': post_list})

def post_detail(request, slug):
    template_name = 'post_detail.html'
    post = get_object_or_404(Post, slug=slug)
    comments = post.comments.filter(active=True)
    new_comment = None    # Comment posted
    if request.method == 'POST':
        comment_form = CommentForm(data=request.POST)
        if comment_form.is_valid():
            # Create Comment object but don't save to database yet
            new_comment = comment_form.save(commit=False)
            # Assign the current post to the comment
            new_comment.post = post
            # Save the comment to the database
            new_comment.save()
    else:
        comment_form = CommentForm()
    return render(request, template_name, {'post': post,
                                           'comments': comments,
                                           'new_comment': new_comment,
                                           'comment_form': comment_form})

def embedded_blog(request):
    post_list = Post.objects.filter(status=1).order_by('-created_on')
    return render(request, 'blog/embedded.html', {'post_list': post_list})

def embedded_post_detail(request, slug):
    post = get_object_or_404(Post, slug=slug)
    comments = post.comments.filter(active=True)

    if request.method == 'POST':
        comment_form = CommentForm(data=request.POST)

        if comment_form.is_valid():
            new_comment = comment_form.save(commit=False)
            new_comment.post = post
            new_comment.save()
            
            return HttpResponseRedirect('/')
    else:
        comment_form = CommentForm()

    return render(request, 'blog/embedded_detail.html', {
        'post': post,
        'comments': post.comments.filter(active=True), 
        'comment_form': comment_form
    })