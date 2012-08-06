# Create your views here.

import sys
import os
import types
import hashlib
import cStringIO, gzip
from django.shortcuts import render_to_response, render
from django.http import HttpResponse, HttpResponseRedirect, QueryDict
from django.utils import simplejson
import json # keeps order of OrderedDict on dumps!
from django.template import RequestContext
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger #paging for lists
from django.core.exceptions import ObjectDoesNotExist
import simplejson


## models
from django.contrib.auth.models import User 

from django.conf import settings
FILES_DIR=settings.FILES_DIR

def home(request):
    context = RequestContext(request)
    
    return render(request,r'mytasks/mytasks.html', locals(), context_instance=context)

@csrf_exempt
def rest_api(request):
    context = RequestContext(request)
    #print "hi"
    #data = simplejson.loads(request.POST['data'])
    #results = calculateStructFact(data)
    #print results
    results={'success':True}
    return HttpResponse(simplejson.dumps(results))

@csrf_exempt
def tasks(request):
    context = RequestContext(request)
    #print "hi"
    #data = simplejson.loads(request.POST['data'])
    #results = calculateStructFact(data)
    #print results
    results={'success':True}
    return HttpResponse(simplejson.dumps(results))