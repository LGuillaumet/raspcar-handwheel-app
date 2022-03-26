from gi.repository import GLib

import logging
import dbus
import dbus.mainloop.glib
import time

logger = logging.getLogger(__name__)

def answer_call(path):
	call = dbus.Interface(bus.get_object('org.ofono', path),
						'org.ofono.VoiceCall')
	time.sleep(2)	
	call.Answer()
	print("    Voice Call [ %s ] Answered" % (path))

def voicecalls_call_added(path, properties):
	print("    Voice Call [ %s ] Added" % (path))

	print(properties.get('LineIdentification'))
	
	""" for key in properties.keys():
		val = str(properties[key])
		print("        %s = %s" % (key, val)) """
	print()

	state = properties["State"]
	# if state == "incoming":
	# 	answer_call(path)
	
	#Test du hung up, ca raccroche de suite
	#if state == "incoming":
	#	hangup_call(path)

def voicecalls_call_removed(path):
	print("    Voice Call [ %s ] Removed" % (path))
	print()

def hangup_call(path):
	call = dbus.Interface(bus.get_object('org.ofono', path),
						'org.ofono.VoiceCall')

	call.Hangup()
	print("    Voice Call [ %s ] Hung up" % (path))

if __name__ == "__main__":
	global vcmanager

	dbus.mainloop.glib.DBusGMainLoop(set_as_default=True)

	bus = dbus.SystemBus()

	manager = dbus.Interface(bus.get_object('org.ofono', '/'),
							'org.ofono.Manager')

	modems = manager.GetModems()
	modem = modems[0][0]

	print("Using modem %s" % modem)

	vcmanager = dbus.Interface(bus.get_object('org.ofono', modem),
						'org.ofono.VoiceCallManager')

	vcmanager.connect_to_signal("CallAdded", voicecalls_call_added)
	vcmanager.connect_to_signal("CallRemoved", voicecalls_call_removed)

	mainloop = GLib.MainLoop()
	mainloop.run()