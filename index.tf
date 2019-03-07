variable "mime_types" {
  default = {
    xml = "text/xml"
    woff2 = "applicaton/font-woff2"
    woff = "applicaton/font-woff"
    otf = "font/opentype"
    eot = "applicaton/font-woff2"
    svg = "image/svg+xml"
    ttf = "application/x-font-ttf"
    htm = "text/html"
    html = "text/html"
    css = "text/css"
    js = "application/javascript"
    map = "application/javascript"
    json = "application/json"
  }
}

# variable "cloudfront_origin_id" {
#   default="dev.local-notices.com"
# }

variable "website_fqdn" {
  default="matt-at.keyboard-writes-code.com"
}

#data "aws_caller_identity" "current" {}

#variable "account_id" {
#  default = "378755625320"
#}

variable "region" {
  default="us-east-1"
}

provider "aws" {
    region = "${var.region}"
}

resource "aws_s3_bucket" "website" {
  bucket = "${var.website_fqdn}"
  acl = "public-read"

  tags {
    Name = "Website"
    Environment = "dev"
  }

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["PUT","POST"]
    allowed_origins = ["*"]
    expose_headers = ["ETag"]
    max_age_seconds = 3000
  }

  policy = <<EOF
{
  "Version": "2008-10-17",
  "Statement": [
    {
      "Sid": "PublicReadForGetBucketObjects",
      "Effect": "Allow",
      "Principal": {
        "AWS": "*"
      },
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::${var.website_fqdn}/*"
    }
  ]
}
EOF

  website {
    index_document = "index.html"
    error_document = "error.html"
  }
}

