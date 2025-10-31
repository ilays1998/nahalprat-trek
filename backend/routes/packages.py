from flask import Blueprint, jsonify
from models import Package

packages_bp = Blueprint("packages", __name__)

@packages_bp.route("/", methods=["GET"], strict_slashes=False)
def list_packages():
    packages = Package.query.filter_by(active=True).all()
    return jsonify([serialize_package(p) for p in packages])

def serialize_package(p):
    return {
        "id": p.id,
        "name": p.name,
        "description": p.description,
        "price_per_person": p.price_per_person,
        "currency": p.currency,
        "active": p.active,
    }
