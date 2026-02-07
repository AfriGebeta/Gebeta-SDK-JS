#!/usr/bin/env bash
# Download maneuver SVGs from Mapbox directions-icons (public domain).
# https://github.com/mapbox/directions-icons
# Run from this directory. Replaces fill="#000000" with fill="currentColor".

set -e
BASE="https://raw.githubusercontent.com/mapbox/directions-icons/master/src/svg"

download() { curl -sL "$BASE/$1" -o "$2" && sed -i '' 's/fill="#000000"/fill="currentColor"/g' "$2"; }

download invalid.svg none.svg
download depart.svg start.svg
download depart_right.svg start-right.svg
download depart_left.svg start-left.svg
download arrive.svg destination.svg
download arrive_right.svg destination-right.svg
download arrive_left.svg destination-left.svg
download new_name_straight.svg becomes.svg
download continue_straight.svg continue.svg
download turn_straight.svg straight.svg
download turn_slight_right.svg slight-right.svg
download turn_right.svg right.svg
download turn_sharp_right.svg sharp-right.svg
download continue_uturn.svg uturn-right.svg
download continue_uturn.svg uturn-left.svg
download turn_sharp_left.svg sharp-left.svg
download turn_left.svg left.svg
download turn_slight_left.svg slight-left.svg
download on_ramp_straight.svg ramp-straight.svg
download on_ramp_right.svg ramp-right.svg
download on_ramp_left.svg ramp-left.svg
download off_ramp_right.svg exit-right.svg
download off_ramp_left.svg exit-left.svg
download fork_straight.svg stay-straight.svg
download fork_right.svg stay-right.svg
download fork_left.svg stay-left.svg
download merge_straight.svg merge.svg
download roundabout.svg roundabout-enter.svg
download roundabout_right.svg roundabout-exit.svg
download depart_straight.svg ferry-enter.svg
download arrive_right.svg ferry-exit.svg
download continue_straight.svg transit.svg
download turn_right.svg transit-connection.svg
download arrive.svg post-transit-connection.svg

echo "Done. All icons from mapbox/directions-icons."
